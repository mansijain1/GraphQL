import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { ApolloServer } from '@apollo/server';
import gql from 'graphql-tag'; 

const typeDefs = gql`
  extend type User @key(fields: "id") {
    id: ID! 
    posts: [Post]
  }

  type Post {
    id: ID!
    title: String!
    authorId: ID!
  }

  type Query {
    posts: [Post]
  }
`;

const API_URL = 'http://localhost:3000/posts';

const resolvers = {
  Query: {
    posts: async () => {
      const res = await fetch(API_URL);
      return res.json();
    }
  },
  User: {
    posts: async (user) => {
      const res = await fetch(API_URL);
      const posts = await res.json();
      return posts.filter((post) => post.authorId === user.id);
    }
  }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }])
});

startStandaloneServer(server, {
  listen: { port: 4002 },
}).then(({ url }) => {
  console.log(`🚀 Posts subgraph ready at ${url}`);
});
