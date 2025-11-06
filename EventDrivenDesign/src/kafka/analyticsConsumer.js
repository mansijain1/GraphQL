const kafka = require('./kafka');
const pubsub = require('./pubsub');

const consumer = kafka.consumer({ groupId: 'analytics-service' });
const topic = 'user-analytics'; 

async function startAnalyticsConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const analytic = JSON.parse(message.value.toString());
      console.log('Analytics consumed:', analytic);

      await pubsub.publish('USER_ANALYTICS', {
        userAnalytics: analytic,
      });
    },
  });
}

module.exports = { startAnalyticsConsumer };
