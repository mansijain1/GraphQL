const { Kafka } = require('kafkajs');
require('dotenv').config();

const kafka = new Kafka({
  clientId: 'topic-creator',
  brokers: ['localhost:9092'],
});

async function createTopics() {
  const admin = kafka.admin();
  await admin.connect();

  const topicName = process.env.KAFKA_TOPIC;
  const numPartitions = parseInt(process.env.KAFKA_NUM_PARTITIONS) || 1;
  const replicationFactor = parseInt(process.env.KAFKA_REPLICATION_FACTOR) || 1;


  await admin.createTopics({
    topics: [
      {
        topic: topicName,
        numPartitions,
        replicationFactor,
      },
    ],
  });
  console.log(`Topic "${topicName}" created successfully with ${numPartitions} partitions and replication factor ${replicationFactor}`);
  console.log("Topic created successfully");
  
  await admin.disconnect();
}

createTopics().catch(console.error);
