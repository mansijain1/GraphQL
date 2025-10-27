## GraphQL Authentication & Authorization Example

This project demonstrates JWT-based authentication and role-based access control (RBAC) using Apollo Server and custom GraphQL directives.

## Features

   - JWT authentication for users.

    - Custom GraphQL directives:
        - @authenticated → ensures user is logged in.
        - @requiresScopes(scopes: [...]) → restricts access to specific roles.

    - Role-based access control for queries and mutations

## How It Works
1. Custom Directives (authDirectives.js)

<pre> 
if (authDirective && !user) {
  throw new GraphQLError("Not authenticated", { extensions: { code: "UNAUTHENTICATED" } });
}
</pre>

- Checks if the @authenticated directive is used on a field.

- Throws an error if there is no logged-in user in context.

<pre>
if (!requiredScopes.includes(user.role) && user.role !== "admin") {
  throw new GraphQLError("Forbidden: insufficient role", { extensions: { code: "FORBIDDEN" } });
}
</pre>

- Checks if the field requires specific roles via @requiresScopes.

- Throws a FORBIDDEN error if the user's role doesn’t match.

- These directives wrap the default resolver and enforce authentication/authorization centrally.

2. Resolvers (resolvers.js)

<pre>
login: (_, { username, password }) => {
  const user = users.find(u => u.username === username && u.password === password);
  return jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
}
</pre>

- Finds a user by username and password.

- Generates a JWT including id, username, and role.

<pre>
users: () => users
</pre>

- Returns all users (access controlled via @requiresScopes in schema).

3. Schema (typeDefs.js)

<pre>
type User @authenticated {
  id: ID!
  username: String!
  role: String
}

type Query {
  me: User @authenticated
  users: [User!]! @requiresScopes(scopes: ["admin"])
}
</pre>

- @authenticated ensures only logged-in users can access User type or me.

- @requiresScopes(scopes: ["admin"]) restricts the users query to admin users.

4. JWT Extraction (auth.js)

<pre>
export const getUserFromToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
</pre>

- Decodes the JWT from the Authorization header.

- Adds the user object to GraphQL context.

5. Server Setup (server.js)

<pre>
const schema = buildSubgraphSchema({ typeDefs, resolvers });
const securedSchema = authDirectives(schema);
const server = new ApolloServer({ schema: securedSchema });
</pre>

- Builds a subgraph schema with Apollo Federation support.

- Applies authentication/authorization directives to all resolvers.

<pre>
context: async ({ req }) => {
  const token = req.headers.authorization?.replace("Bearer ", "") || "";
  const user = getUserFromToken(token);
  return { user };
}
</pre>

- Extracts the user from JWT for each request and passes it to resolvers via context.

## Quick Usage

1. Login - Returns a JWT token.
<pre>
mutation {
  login(username: "alice", password: "password123")
}
</pre>

2. Authenticated Query
<pre>
query {
  me { 
    id u
    sername 
    role 
  }
}
</pre>

3. Role-Restricted Query - Requires admin role.
<pre>
query {
  me { 
    id u
    sername 
    role 
  }
}
</pre>