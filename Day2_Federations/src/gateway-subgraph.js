import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloGateway } from '@apollo/gateway';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the pre-composed supergraph schema
const supergraphPath = path.join(__dirname, '../src/schema/supergraph-schema.graphql');
const supergraphSdl = fs.readFileSync(supergraphPath, 'utf-8');

const gateway = new ApolloGateway({
  supergraphSdl,
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`🚀 Gateway ready at ${url}`);
}).catch((err) => {
  console.error("Failed to start gateway subgraph", err);
});
