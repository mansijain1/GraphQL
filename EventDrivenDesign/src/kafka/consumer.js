const kafka = require('./kafka');
const { addUser , updateUser, deleteUser , getUser} = require('../graphQL/readModel');
const pubsub = require('./pubsub');

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
      
      let normalizedEvent = event;
      
      switch (event.type) {
        case 'USER_CREATED':
          addUser(event.data);
          break;
        case 'USER_UPDATED':
          updateUser(event.data.newUser.id, event.data.newUser);
          normalizedEvent = {
            type: event.type,
            data: event.data.newUser,
          };
          break;
        case 'USER_DELETED':
          deleteUser(event.data.id);
          normalizedEvent = {
            type: event.type,
            data: event.data, 
          };
          break;
        default:
          console.log(`Unknown event type: ${event.type}`);
      }
      
      await pubsub.publish('USER_EVENTS', { userEvents: normalizedEvent });
    },
  });
}

module.exports = { startConsumer };
