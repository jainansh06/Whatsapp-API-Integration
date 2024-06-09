import json
from flask import Flask, render_template, request
from message_helper import send_message, get_text_message_input

app = Flask(__name__)

with open('config.json') as f:
    config = json.load(f)

app.config.update(config)

@app.route("/")
def home():
    return render_template('new_page.html')

@app.route("/send-message", methods=['POST'])
def send_message_route():
    phone_number = request.form.get("phone_number")
    default_message = "This is a default message from our WhatsApp bot!"
    data = get_text_message_input(phone_number, default_message)
    import asyncio
    asyncio.run(send_message(data))
    return "Message sent successfully!"

@app.route("/webhook", methods=['POST'])
def webhook():
    message = request.get_json()
    phone_number = message["from"]
    message_text = message["text"]
    
    default_response = "Thank you for reaching out to us!"
    data = get_text_message_input(phone_number, default_response)
    import asyncio
    asyncio.run(send_message(data))
    
    return "Webhook received!"

if __name__ == "__main__":
    app.run(debug=True)
