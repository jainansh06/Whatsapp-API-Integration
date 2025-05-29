const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  number: String,
  message: String,
  reply: String,
  model: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);
