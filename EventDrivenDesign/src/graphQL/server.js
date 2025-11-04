const { ApolloServer } = require('apollo-server');

// Load env first
const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { startConsumer } = require('../kafka/consumer');
const { typeDefs, resolvers } = require('./schema');

async function start() {

  await startConsumer();

  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await server.listen({ port: 4000 });
  console.log(`GraphQL ready at ${url}`);
}

start().catch(console.error);







// Kafka consumer updates the read model (projection)
// consume('user-events', (event) => {
//   if (event.type === 'USER_CREATED') {
//     readModel.users.push(event.data);
//   }
// });



