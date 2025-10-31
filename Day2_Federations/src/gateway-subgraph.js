import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloGateway } from '@apollo/gateway';
import 'dotenv/config';

const gateway = new ApolloGateway({
  graphRef: process.env.APOLLO_GRAPH_REF,
  key: process.env.APOLLO_KEY,        
  experimental_pollInterval: 10000,   // refresh supergraph every 10 seconds
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Gateway ready at ${url}`);
}).catch((err) => {
  console.error("Failed to start gateway subgraph", err);
});
