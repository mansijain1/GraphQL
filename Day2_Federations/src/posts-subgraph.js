import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { ApolloServer } from '@apollo/server';
import gql from 'graphql-tag'; 

const typeDefs = gql`
  # extend type User @key(fields: "id") {
  #   id: ID!
  #   name: String! @external
  #   posts: [Post]
  # }

# Created local stub so even if User subgraph not present Posts will work
  type User @key(fields: "id") {
    id: ID!
    name: String! @external
  }

  type Post {
    id: ID!
    title: String!
    authorId: ID!
    """Number of views the post has received"""
    views: Int!
    author: User @provides(fields: "name")
  }

  extend type User @key(fields: "id") {
    posts: [Post]
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
  },
  Post: {
     author: async (post) => {
      return fetch(`http://localhost:3000/users/${post.authorId}`)
        .then(res => res.json())
        .then(user => ({
          __typename: 'User',
          id: post.authorId,
          name: user.name,
        }));
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }])
});

startStandaloneServer(server, {
  listen: { port: 4002 },
}).then(({ url }) => {
  console.log(`Posts subgraph ready at ${url}`);
}).catch((err) => {
  console.error("Failed to start posts subgraph:", err);
});
