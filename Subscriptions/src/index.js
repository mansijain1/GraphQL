import express from 'express';
import http from 'node:http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import bodyParser from 'body-parser';
import cors from 'cors';
import { makeExecutableSchema } from '@graphql-tools/schema';
import {typeDefs } from './server/graphql/typeDefs.js';
import {resolvers} from './server/graphql/resolvers.js'

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = http.createServer(app);

// WebSocket server for subscriptions
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

useServer({ schema }, wsServer);

// ApolloServer for Queries + Mutations
const server = new ApolloServer({ schema });
await server.start();
app.use('/graphql', cors(), bodyParser.json(), expressMiddleware(server));

httpServer.listen(4000, () => {
  console.log('HTTP + WebSocket server ready at http://localhost:4000/graphql');
});
