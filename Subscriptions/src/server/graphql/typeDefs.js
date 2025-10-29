import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Message {
    id: ID!
    content: String!
  }

  type Query {
    messages: [Message!]
  }

  type Mutation {
    postMessage(content: String!): Message
  }

  type Subscription {
    messageAdded: Message
  }
`;