const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'graphql-service',
  brokers: ['localhost:9092'], // since Kafka runs in Docker, Node connects via localhost
});

module.exports = kafka;
