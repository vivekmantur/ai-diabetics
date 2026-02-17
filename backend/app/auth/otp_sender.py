import os
from twilio.rest import Client

ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
FROM_WHATSAPP = os.getenv("TWILIO_WHATSAPP_NUMBER")

client = Client(ACCOUNT_SID, AUTH_TOKEN)


def send_otp(phone: str, otp: str):
    message = client.messages.create(
        body=f"Your AI Diabetes OTP is: {otp}",
        from_=FROM_WHATSAPP,
        to=f"whatsapp:+91{phone}",
    )

    return message.sid
