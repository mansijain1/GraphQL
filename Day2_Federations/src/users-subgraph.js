import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { ApolloServer } from '@apollo/server'
import gql from 'graphql-tag'; 

const typeDefs = gql`
  type User @key(fields: "id") {
    id: ID!
    name: String!
    age: Int!
  }

  type Query {
    users: [User]
    user(id: ID!): User
  }
`;

const API_URL = 'http://localhost:3000/users';

const resolvers = {
  Query: {
    users: async () => {
      const res = await fetch(API_URL);
      return res.json();
    },
    user: async (_, { id }) => {
      const res = await fetch(`${API_URL}/${id}`);
      return res.ok ? res.json() : null;
    }
  },
  User: {
    __resolveReference: async (reference) => {
      const res = await fetch(`${API_URL}/${reference.id}`);
      return res.ok ? res.json() : null;
    }
  }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

startStandaloneServer(server, {
  listen: { port: 4001 },
}).then(({ url }) => {
  console.log(`Users subgraph ready at ${url}`);
}).catch((err) => {
  console.error("Failed to start users subgraph:", err);
});
