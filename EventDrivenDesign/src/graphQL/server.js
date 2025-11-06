const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { useServer } = require('graphql-ws/use/ws');
const { WebSocketServer } = require('ws');
const express = require('express');
const http = require('node:http');

// Load env first
const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { startConsumer } = require('../kafka/consumer');
const { startAnalyticsConsumer } = require('../kafka/analyticsConsumer');
const { typeDefs, resolvers } = require('./schema');
const pubsub = require('../kafka/pubsub');

async function start() {
 const schema = makeExecutableSchema({ typeDefs, resolvers });

  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  console.log('pubsub type check:', typeof pubsub, pubsub.constructor?.name);
  console.log('pubsub methods:', Object.keys(pubsub));

   // Use graphql-ws to handle subscription connections
  useServer({ schema, context: async () => { console.log('⚡ WS context initialized');
      return { pubsub }; } }, wsServer);

  // ApolloServer (for queries & mutations)
  const server = new ApolloServer({ schema });
  await server.start();
  app.use('/graphql', express.json(), expressMiddleware(server, {
    context: async () => ({ pubsub }),
  }));

  await startConsumer();
await startAnalyticsConsumer();  // new consumer for Spark analytics


  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log(`GraphQL ready at http://localhost:${PORT}/graphql`);
    console.log(`Subscriptions ready at ws://localhost:${PORT}/graphql`);
  });
}

start().catch(console.error);
