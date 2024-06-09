Steps to Run the Project:

Clone the Repository:

First, clone the GitHub repository using the following command:
bash
Copy code
git clone [https://github.com/jainansh06/Whatsapp-API-Integration.git]
Install Dependencies:

Navigate to the project directory and install the required dependencies:
bash
Copy code
cd [project-directory]
pip install -r requirements.txt
Configure API Tokens and Details:

Fill in the necessary API tokens, phone numbers, and access token details in the config.json file. This file is crucial for the proper functioning of the WhatsApp Business API.
Run the Application:

To start the application, run the following command in your terminal:
bash
Copy code
python3 app.py
This command will start the Flask server, and you will get a link to access the web page.
Access the Web Page:

Open the provided link in your web browser to access the web page where you can input a phone number and send a message via WhatsApp.
Phone Numbers Storage:

The phone numbers are saved in the phone_numbers.db file.
To view the saved phone numbers, you can navigate to [your-link]/phone-number in your browser.
