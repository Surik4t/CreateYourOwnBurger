import os
import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
from Receipt import create_receipt
import socket
import json

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = os.getenv("SMTP_PORT")
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASS = os.getenv("SMTP_PASSWORD")


def send_email(data, queue):
    def generate_user_confirmation_message(data):
        message = MIMEMultipart()
        message["From"] = SMTP_EMAIL
        message["To"] = data["email"]
        message["Subject"] = "Подтверждение регистрации"

        html_content = f"""
        <h1>Добро пожаловать, {data["username"]}!</h1>
        <p>Ваш код подтвержения: {data["code"]}</p>
        """
        message.attach(MIMEText(html_content, "html"))
        return message


    def generate_receipt(data):
        message = MIMEMultipart()
        message["From"] = SMTP_EMAIL
        message["To"] = data["email"]
        message["Subject"] = "Receipt" 

        receipt = create_receipt(data)
        message.attach(MIMEText(receipt, "html"))
        return message


    try:
        data = json.loads(data)
        if queue == "confirmation":
            message = generate_user_confirmation_message(data)
        if queue == "receipts":
            message = generate_receipt(data)

        context = ssl.create_default_context()

        with smtplib.SMTP_SSL(
            SMTP_SERVER, SMTP_PORT, context=context, timeout=30
        ) as server:
            server.login(SMTP_EMAIL, SMTP_PASS)
            server.sendmail(SMTP_EMAIL, data["email"], message.as_string())
            print(f"Email to {data["email"]} has been sent")

    except socket.timeout:
        print("Ошибка: Таймаут подключения к SMTP серверу")
    except smtplib.SMTPAuthenticationError:
        print("Ошибка: Неправильный логин или пароль SMTP")
    except smtplib.SMTPRecipientsRefused:
        print("Ошибка: Неправильный email получателя")
    except smtplib.SMTPServerDisconnected:
        print("Ошибка: Сервер разорвал соединение")
    except Exception as e:
        print(f"Неизвестная ошибка: {e}")
