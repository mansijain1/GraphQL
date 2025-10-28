import { gql } from 'graphql-tag';

export const typeDefs =  gql`
  directive @defer(label: String) on FIELD | FRAGMENT_SPREAD | INLINE_FRAGMENT
  directive @stream(label: String, initialCount: Int) on FIELD

  type Author {
    id: ID!
    name: String!
    bio: String
  }

  type Post {
    id: ID!
    title: String!
    body: String
    author: Author!
  }

  type Query {
    posts: [Post!]!
  }
`;