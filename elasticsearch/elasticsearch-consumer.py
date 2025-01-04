from kafka import KafkaConsumer
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk, BulkIndexError
import json
from datetime import datetime


def consume_kafka_messages():
    consumer = KafkaConsumer(
        "ready_data",
        bootstrap_servers="localhost:9094",
        value_deserializer=lambda m: json.loads(m.decode("utf-8")),
        api_version=(3, 8, 0),
    )

    try:
        for message in consumer:
            yield message.value
    except KeyboardInterrupt:
        print("consumer stop")
    finally:
        consumer.close()


def insert_bulk_data(es, actions, index_name):
    try:
        bulk(es, actions)
        print(f"Inserted {len(actions)} documents into the index '{index_name}'.")
    except BulkIndexError as e:
        print(f"Failed to index some documents: {e.errors}")


def process_and_insert_data():
    es = Elasticsearch("http://localhost:9200")

    index_name = "tweets"

    if not es.indices.exists(index=index_name):
        es.indices.create(
            index=index_name,
            body={
                "mappings": {
                    "properties": {
                        "text": {"type": "text"},
                        "hashtags": {"type": "keyword"},
                        "coordinates": {"type": "geo_point"},
                        "created_at": {
                            "type": "date",
                            "format": "strict_date_optional_time",
                        },
                        "sentiment": {"type": "keyword"},
                    }
                }
            },
            ignore=400,
        )

    actions = []

    for tweet in consume_kafka_messages():
        coordinates = None
        if tweet["coordinates"] != ["unknown"]:
            try:
                coordinates = {
                    "lat": float(tweet["coordinates"][0]),
                    "lon": float(tweet["coordinates"][1]),
                }
            except ValueError:
                print(f"Invalid coordinates: {tweet['coordinates']}")

        try:
            created_at = (
                datetime.strptime(tweet["created_at"], "%Y-%m-%dT%H:%M:%S%z")
                .isoformat()
                .replace("+00:00", "Z")
            )
        except ValueError:
            print(f"Invalid date format: {tweet['created_at']}")
            continue

        action = {
            "_index": index_name,
            "_source": {
                "text": tweet["text"],
                "hashtags": tweet["hashtags"],
                "coordinates": coordinates,
                "created_at": created_at,
                "sentiment": (
                    tweet["sentiment"]
                    if tweet["sentiment"] in ["positive", "negative", "na"]
                    else None
                ),
            },
        }
        actions.append(action)

        if len(actions) >= 1000:
            insert_bulk_data(es, actions, index_name)
            actions.clear()

    if actions:
        insert_bulk_data(es, actions, index_name)


if __name__ == "__main__":
    process_and_insert_data()
