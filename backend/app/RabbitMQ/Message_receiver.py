import pika, sys, os
from SMTP import send_email

def main():
    connection = pika.BlockingConnection(pika.ConnectionParameters(host="localhost"))
    channel = connection.channel()

    channel.queue_declare(queue="confirmation")
    channel.queue_declare(queue="receipts")

    def callback(ch, method, properties, body):
        print(f" [x] Received {body}")
        try:
            print(f" [x] Sending email...")
            send_email(body, queue=method.routing_key)
        except Exception as e:
            print(f" [x] Something went wrong: {e}")

    channel.basic_consume(queue="confirmation", on_message_callback=callback, auto_ack=True)
    channel.basic_consume(queue="receipts", on_message_callback=callback, auto_ack=True)

    print(" [*] Waiting for messages. To exit press CTRL+C")
    channel.start_consuming()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("Interrupted")
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)