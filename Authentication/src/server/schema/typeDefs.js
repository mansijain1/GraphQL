import { gql } from 'graphql-tag';

export const typeDefs = gql`

  extend schema
  @link(url: "https://specs.apollo.dev/federation/v2.5",
        import: ["@authenticated", "@requiresScopes"])

  type User @authenticated {
    id: ID!
    username: String!
    role: String
  }

  type Query {
    me: User @authenticated
    users: [User!]! @requiresScopes(scopes: ["admin"])
    userById(id: ID!): User
  }

  type Mutation {
    login(username: String!, password: String!): String
    createUser(username: String!, password: String!): User
  }
`;