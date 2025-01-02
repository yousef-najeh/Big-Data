from kafka import KafkaConsumer
import json


def main():
    consumer = KafkaConsumer(
        "ready_data",
        bootstrap_servers="localhost:9094",
        value_deserializer=lambda m: json.loads(m.decode("utf-8")),
        api_version=(3, 8, 0),
    )

    print("connect to topic: ready_data")

    try:
        for message in consumer:
            print(json.dumps(message.value, indent=4))
    except KeyboardInterrupt:
        print("consumer closed.")
    finally:
        consumer.close()


if __name__ == "__main__":
    main()
