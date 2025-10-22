export const typeDefs = `#graphql
  type Game {
    id: ID!
    title: String!
    platform: [String!]!
  }

  input GameInput {
    title: String!
    platform: [String!]!
  }

  type Review {
    id: ID!
    rating: Int!
    content: String! 
  }

  type Reviewer {
    id: ID!
    name: String!
    verified: Boolean!
  }

  type Author {
    name: String
    verified: Boolean
  }

  type Publisher {
    name: String
    number_of_pages: Int
  }

  type Subject {
    name: String
    url: String 
  }

  type Excerpt {
    text: String
    comment: String
    first_sentence: Boolean
  }

  type Cover {
    small: String
    medium: String
    large: String
  }

  type Contributor {
    role: String
    name: String
  }

  type Work {
    key: String
    title: String
  }

  type Book {
    title: String
    subtitle: String
    publishDate: String
    url: String
    key: String
    authors: [Author]
    number_of_pages: Int
    by_statement: String
    isbn_13: [String]
    openlibrary: [String]
    publish_date: String 
    publishers: [Publisher]
    subjects: [Subject]
    excerpts: [Excerpt]
    cover: [Cover]
    info_url: String
    preview: String
    preview_url: String 
    thumbnail_url: String
    works: [Work]
    physical_format: String 
    copyright_date: String
    contributors: [Contributor] 
    first_sentence: String @deprecated(reason: "not applicable")
  }

  type Query {
    games: [Game]
    getGameById(id: ID!): Game
    reviews: [Review]
    getReviewById(id: ID!): Review
    allReviewers: [Reviewer]
    getReviewer(id: ID!): Reviewer
    getBookByISBN(isbn: String!): Book
    getBookByOLID(olid: String!): Book
    listSubjects: [Subject]

  }

  type Mutation {
     addGame(game: GameInput!): Game!
  }
`;
