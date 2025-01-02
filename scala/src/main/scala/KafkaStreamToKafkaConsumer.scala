import org.apache.spark.sql.functions._
import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.streaming.Trigger
import org.apache.spark.sql.types.{StringType, StructType, ArrayType}
import com.johnsnowlabs.nlp.pretrained.PretrainedPipeline
import com.johnsnowlabs.nlp.SparkNLP
import org.apache.spark.sql.expressions.UserDefinedFunction

object KafkaStreamToKafkaConsumer {
  def main(args: Array[String]): Unit = {

    // Initialize Spark NLP
    val spark = SparkSession.builder()
      .appName("SparkKafkaSentimentAnalysis")
      .master("local[2]")
      .config("spark.jars.packages", "JohnSnowLabs:spark-nlp")
      .getOrCreate()

    spark.sparkContext.setLogLevel("WARN")

    // Kafka input stream
    val kafkaStream = spark.readStream
      .format("kafka")
      .option("kafka.bootstrap.servers", "localhost:9094")
      .option("subscribe", "testing")
      .option("failOnDataLoss", "false")
      .option("startingOffsets", "earliest")
      .load()

    val messageStream = kafkaStream.selectExpr("CAST(value AS STRING) AS json_value")

    // Define schema for incoming JSON data
    val schema = new StructType()
      .add("text", StringType)
      .add("created_at", StringType)
      .add("entities", new StructType().add("hashtags", ArrayType(new StructType().add("text", StringType))))
      .add("geo", new StructType().add("coordinates", ArrayType(StringType)))

    val parsedStream = messageStream
      .select(from_json(col("json_value"), schema).alias("parsed"))
      .select("parsed.text", "parsed.created_at", "parsed.entities.hashtags", "parsed.geo.coordinates")

    // Handle hashtags and geo columns
    val geoStream = parsedStream
      .withColumn("hashtags",
        when(col("hashtags").isNotNull, concat_ws(", ", col("hashtags.text")))
          .otherwise(lit("")))

      .withColumn("geo",
        when(col("coordinates").isNotNull, col("coordinates"))
          .otherwise(array(lit("unknown"))))

    // Load Spark NLP Pretrained Sentiment Analysis Pipeline
    val sentimentPipeline = PretrainedPipeline("analyze_sentiment", lang = "en")

    // Define UDF for sentiment analysis
    val sentimentUDF: UserDefinedFunction = udf((text: String) => {
      if (text != null && text.nonEmpty) {
        val result = sentimentPipeline.annotate(text)
        result.getOrElse("sentiment", Seq("unknown")).head
      } else "unknown"
    })

    // Add sentiment analysis column
    val sentimentStream = geoStream
      .withColumn("sentiment", sentimentUDF(col("text")))

    // Prepare data for Kafka
    val kafkaStreamToSend = sentimentStream
      .selectExpr("CAST(null AS STRING) AS key", "CAST(sentiment AS STRING) AS value")

    // Write the processed data to the console for debugging
    sentimentStream.writeStream
      .outputMode("append")
      .format("console")
      .start()

    // Write the processed data to Kafka
    val query = kafkaStreamToSend
      .writeStream
      .outputMode("append")
      .format("kafka")
      .option("kafka.bootstrap.servers", "localhost:9094")
      .option("topic", "ready_data")
      .option("checkpointLocation", "./src/checkpoint")
      .trigger(Trigger.ProcessingTime("20 seconds"))
      .start()

    query.awaitTermination()
  }
}


