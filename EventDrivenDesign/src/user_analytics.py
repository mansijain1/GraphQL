from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col, count, window, current_timestamp
from pyspark.sql.types import StructType, StructField, StringType

# Initialize Spark
spark = (
    SparkSession.builder
        .appName("UserAnalytics")
        .getOrCreate()
)

kafka_bootstrap = "localhost:9092"
topic_in = "user-events"
topic_out = "user-analytics"

# Read messages from Kafka
df_raw = (
    spark.readStream
         .format("kafka")
         .option("kafka.bootstrap.servers", kafka_bootstrap)
         .option("subscribe", topic_in)
         .option("startingOffsets", "latest")
         .load()
)

# Define JSON schema for incoming Kafka messages
schema = StructType([
    StructField("type", StringType()),
    StructField("data", StructType([
        StructField("id", StringType()),
        StructField("name", StringType())
    ]))
])

# Parse JSON message
df = df_raw.select(from_json(col("value").cast("string"), schema).alias("event"))

# Add timestamp for windowing
events = df.select("event.*").withColumn("timestamp", current_timestamp())

# Count created users every minute
windowed = (
    events.filter(col("type") == "USER_CREATED")
          .groupBy(window(col("timestamp"), "1 minute"))
          .agg(count("*").alias("created_count"))
          .selectExpr(
              "to_json(struct(window.start as window_start, window.end as window_end, created_count)) as value"
          )
)

# Write aggregated results to Kafka
query = (
    windowed.writeStream
            .format("kafka")
            .option("kafka.bootstrap.servers", kafka_bootstrap)
            .option("topic", topic_out)
            .option("checkpointLocation", "/tmp/spark-checkpoints/user-analytics")
            .outputMode("update")
            .start()
)

query.awaitTermination()
