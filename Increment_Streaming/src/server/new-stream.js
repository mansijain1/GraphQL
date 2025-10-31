import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './graphql/typeDefs.js';
import { resolvers } from './graphql/resolvers.js';

const schema = makeExecutableSchema({ typeDefs, resolvers });

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/graphql',
});

const server = createServer(yoga);

server.listen(8000, () => {
  console.log('Yoga GraphQL Server with Streaming ready at http://localhost:8000/graphql');
});

