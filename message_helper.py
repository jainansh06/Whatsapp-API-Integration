import aiohttp
import json
import ssl
import certifi
from flask import current_app

async def send_message(data):
    headers = {
        "Content-type": "application/json",
        "Authorization": f"Bearer {current_app.config['ACCESS_TOKEN']}",
    }

   
    ssl_context = ssl.create_default_context(cafile=certifi.where())

    async with aiohttp.ClientSession(connector=aiohttp.TCPConnector(ssl=ssl_context)) as session:
        url = f'https://graph.facebook.com/{current_app.config["VERSION"]}/{current_app.config["PHONE_NUMBER_ID"]}/messages'
        async with session.post(url, data=data, headers=headers) as response:
            response_text = await response.text()
            if response.status == 200:
                print("Message sent successfully!")
                print(f"Response: {response_text}")
            else:
                print(f"Error sending message: {response.status}")
                print(f"Response: {response_text}")

def get_text_message_input(recipient, text):
    return json.dumps({
        "messaging_product": "whatsapp",
        "to": recipient,
        "type": "text",
        "text": {
            "body": text
        }
    })
