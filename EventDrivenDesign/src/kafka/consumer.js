const kafka = require('./kafka');
const { addUser , updateUser, deleteUser , getUser} = require('../graphQL/readModel');

const consumer = kafka.consumer({ groupId: 'user-service' });
const topic = process.env.KAFKA_TOPIC;

if (!topic) {
  throw new Error("KAFKA_TOPIC is not defined. Check your .env path!");
}

async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());
      console.log('Consumed:', event);

      switch (event.type) {
        case 'USER_CREATED':
          addUser(event.data);
          break;
        case 'USER_UPDATED':
          updateUser(event.data.newUser.id, event.data.newUser);
          break;
        case 'USER_DELETED':
          deleteUser(event.data.id);
          break;

        default:
          console.log(`Unknown event type: ${event.type}`);
      }
    },
  });
}

module.exports = { startConsumer };
