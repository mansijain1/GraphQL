import { gql } from "graphql-tag";

export const typeDefs = gql`
  directive @cacheControl(
    maxAge: Int
    scope: CacheControlScope
  ) on FIELD_DEFINITION | OBJECT | INTERFACE

  enum CacheControlScope {
    PUBLIC
    PRIVATE
  }

  type Book {
    id: ID!
    title: String!
    author: String!
  }

  type Query {
    bookById(id: ID!): Book
    allBooks: [Book!]! @cacheControl(maxAge: 60) 
  }
`;