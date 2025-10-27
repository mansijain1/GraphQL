export const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    role: String!
  }

  type Query {
    me: User
    users: [User!]!
    # users: [User!]! @requiresScopes(scopes: ["ADMIN"])
    # adminData: String @requiresScopes(scopes: ["ADMIN"])
    userById(id: ID!): User
  }

  type Mutation {
    login(username: String!, password: String!): String
    createUser(username: String!, password: String!): User
  }
`;