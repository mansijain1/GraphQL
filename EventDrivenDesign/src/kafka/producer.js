const kafka = require('./kafka');
const { Partitioners } = require('kafkajs'); 

const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
const topic = process.env.KAFKA_TOPIC

async function produce(topic, message) {
   if (!topic || typeof topic !== 'string') {
    throw new Error(`Invalid topic: ${topic}`);
  }
  if (!message) {
    throw new Error("Message is undefined!");
  }

  await producer.connect();
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
    console.log(`Produced: ${topic}`, message);
}

module.exports = { produce };
