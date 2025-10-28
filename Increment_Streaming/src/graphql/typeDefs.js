export const typeDefs = `
  directive @defer(
    label: String
    if: Boolean = true
  ) on FRAGMENT_SPREAD | INLINE_FRAGMENT

  directive @stream(
    label: String
    initialCount: Int = 0
    if: Boolean = true
  ) on FIELD

  type Product {
    id: ID!
    name: String!
    comments: [String!]
    relatedProducts: [Product!]
  }

  type Query {
    products: [Product!]
  }
`;
