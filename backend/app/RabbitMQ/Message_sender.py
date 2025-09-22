import pika
import json
from database.models import UnconfirmedUser

IP = "localhost"


def queue_message(user: UnconfirmedUser):
    connection = pika.BlockingConnection(pika.ConnectionParameters(IP))
    channel = connection.channel()

    channel.queue_declare(queue="confirmation")

    message_data = {
            "username": user.username,
            "email": user.email,
            "code": user.confirmation_code,
        }

    channel.basic_publish(
        exchange="",
        routing_key="confirmation",
        body=json.dumps(message_data)
    )
    print(f"Message for {user.email} sent to queue.")

    connection.close()
