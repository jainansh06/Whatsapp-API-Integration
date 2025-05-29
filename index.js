require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose');
const { CohereClient } = require('cohere-ai');
const OpenAI = require('openai');
const Fuse = require('fuse.js');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Cohere and OpenAI
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Load insurance domain data
const policies = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'policies.json')));
const hospitals = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'hospitals.json')));
const claims = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'claims.json')));

// Fuzzy Search Setup
const fusePolicyCategories = new Fuse(policies, { keys: ['category'], threshold: 0.3 });
const fuseClaimCategories = new Fuse(claims, { keys: ['category'], threshold: 0.3 });

// MongoDB setup
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const chatSchema = new mongoose.Schema({
  number: String,
  message: String,
  reply: String,
  model: String,
  timestamp: { type: Date, default: Date.now }
});
const Chat = mongoose.model('Chat', chatSchema);

// Middleware
app.use(bodyParser.json());

// Webhook verification
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token && mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('🟢 Webhook verified');
    res.status(200).send(challenge);
  } else {
    console.log('🔴 Webhook verification failed');
    res.sendStatus(403);
  }
});

// Webhook message receiver
app.post('/webhook', async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const message = change?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const number = message.from;
    const userMessage = message.text?.body || 'No message';
    const messageLower = userMessage.toLowerCase();

    console.log(`📨 Message from ${number}: ${userMessage}`);

    let reply = null;
    let modelUsed = "insurance-rule";

    if (messageLower.includes("policy") || messageLower.includes("insurance")) {
      const catMatch = fusePolicyCategories.search(userMessage).slice(0, 3);
      reply = catMatch.length
        ? `📂 Category Policies:\n` + catMatch.map(p => `• ${p.item.name}: ${p.item.description}`).join("\n")
        : "📄 Top Policies:\n" + policies.slice(0, 3).map(p => `• ${p.name}: ${p.description}`).join("\n");
    } else if (messageLower.includes("hospital")) {
      reply = "🏥 Nearby Hospitals:\n" + hospitals.slice(0, 3).map(h => `• ${h.name}, ${h.city}`).join("\n");
    } else if (messageLower.includes("claim")) {
      const catMatch = fuseClaimCategories.search(userMessage).slice(0, 3);
      reply = catMatch.length
        ? `🧾 Claim Info:\n` + catMatch.map(c => `• ${c.item.reason}: ${c.item.process}`).join("\n")
        : "📝 Claim Help:\n" + claims.slice(0, 3).map(c => `• Reason: ${c.reason}`).join("\n");
    } else {
      const smartReply = await getSmartReplyWithFallback(userMessage);
      reply = smartReply.reply;
      modelUsed = smartReply.modelUsed;
    }

    await sendWhatsAppMessage(number, reply);
    await Chat.create({ number, message: userMessage, reply, model: modelUsed });

    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Webhook error:', err);
    res.sendStatus(500);
  }
});

// API to get all chats (dashboard)
app.get('/api/chats', async (req, res) => {
  try {
    const chats = await Chat.find().sort({ timestamp: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// Smart reply fallback logic
async function getSmartReplyWithFallback(prompt) {
  try {
    const response = await cohere.generate({
      model: 'command',
      prompt: `Respond to the user in a helpful and concise manner.\nUser: ${prompt}\nBot:`,
      max_tokens: 100,
      temperature: 0.7,
    });
    const text = response.generations?.[0]?.text?.trim();
    if (text) return { reply: text, modelUsed: 'cohere' };
  } catch (error) {
    console.error('❌ Cohere error:', error.message);
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    const text = completion.choices[0].message.content.trim();
    if (text) return { reply: text, modelUsed: 'openai-gpt4' };
  } catch (error) {
    console.error('❌ OpenAI error:', error.message);
  }

  try {
    // TODO: Implement Gemini API call
    throw new Error('Gemini API not implemented');
  } catch (error) {
    console.error('❌ Gemini error:', error.message);
  }

  return { reply: "Sorry, I couldn't generate a response right now.", modelUsed: 'none' };
}

// Send WhatsApp message
async function sendWhatsAppMessage(recipientPhone, text) {
  try {
    await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: recipientPhone,
        text: { body: text }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(`✅ Reply sent to ${recipientPhone}: ${text}`);
  } catch (error) {
    console.error('❌ Error sending WhatsApp message:', error.response?.data || error.message);
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
