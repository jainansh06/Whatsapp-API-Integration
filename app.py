import json
from flask import Flask, render_template, request
from message_helper import send_message, get_text_message_input
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import PhoneNumber, Base

app = Flask(__name__)

with open('config.json') as f:
    config = json.load(f)

app.config.update(config)

# Database setup
DATABASE_URL = "sqlite:///phone_numbers.db"
engine = create_engine(DATABASE_URL)
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
session = DBSession()

@app.route("/")
def home():
    return render_template('new_page.html')

@app.route("/send-message", methods=['POST'])
def send_message_route():
    phone_number = request.form.get("phone_number")
    default_message = "This is a default message"
    data = get_text_message_input(phone_number, default_message)
    
    # Save the phone number to the database
    if not session.query(PhoneNumber).filter_by(phone_number=phone_number).first():
        new_phone_number = PhoneNumber(phone_number=phone_number)
        session.add(new_phone_number)
        session.commit()

    import asyncio
    asyncio.run(send_message(data))
    return "Message sent successfully!"

@app.route("/webhook", methods=['POST'])
def webhook():
    message = request.get_json()
    phone_number = message["from"]
    message_text = message["text"]
    
    default_response = "Thank you"
    data = get_text_message_input(phone_number, default_response)
    
    # Save the phone number to the database
    if not session.query(PhoneNumber).filter_by(phone_number=phone_number).first():
        new_phone_number = PhoneNumber(phone_number=phone_number)
        session.add(new_phone_number)
        session.commit()

    import asyncio
    asyncio.run(send_message(data))
    
    return "Webhook received!"

@app.route("/phone-numbers")
def phone_numbers():
    phone_numbers = session.query(PhoneNumber).all()
    return render_template('phone_numbers.html', phone_numbers=phone_numbers)

if __name__ == "__main__":
    app.run(debug=True)
