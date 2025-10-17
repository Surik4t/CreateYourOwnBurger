import pika
import json
from database.models import UnconfirmedUser, ReceiptData

IP = "localhost"

def queue_message(message, queue: str):
    connection = pika.BlockingConnection(pika.ConnectionParameters(IP))
    channel = connection.channel()
    channel.queue_declare(queue=queue)

    channel.basic_publish(
        exchange="",
        routing_key=queue,
        body=json.dumps(message)
    )
    print(f"Message sent.")

    connection.close()
