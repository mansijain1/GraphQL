import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
  }

  type Query {
    bookById(id: ID!): Book
    allBooks: [Book!]!
  }
`;