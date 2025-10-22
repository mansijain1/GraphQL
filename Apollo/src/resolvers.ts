import fetch from "node-fetch";
import db from "./db.js";
import { OpenLibraryResponse } from './types/book.js';
import { transformBookData } from "./utils/transformBook.js";

export const resolvers = {
  Query: {
    games() {
      return db.games;
    },
    getGameById(_, args) {
      return db.games.find((game) => game.id === args.id);
    },
    reviews() {
      return db.reviews;
    },
    getReviewById(_, args) {
      return db.reviews.find((review) => review.id === args.id);
    },
    allReviewers() {
      return db.reviewers;
    },
    getReviewer(_, args) {
      return db.reviewers.find((author) => author.id === args.id);
    },

    async getBookByISBN(_: any, { isbn }) {
      const url = `http://openlibrary.org/api/volumes/brief/isbn/${isbn}.json`;
      const res = await fetch(url);
      const data = (await res.json()) as OpenLibraryResponse;

      const recordKey = Object.keys(data.records)[0];
      if (!recordKey) return null;
      const record = data.records[recordKey];
      return transformBookData(record.data, record.url);
    },

    getBookByOLID: async (_: any, { olid }) => {
    const url = `https://openlibrary.org/api/volumes/brief/olid/${olid}.json`;
    const res = await fetch(url);
    const data = (await res.json()) as OpenLibraryResponse;

    const recordKey = Object.keys(data.records)[0];
    if (!recordKey) return null;

    const record = data.records[recordKey];
    return transformBookData(record.data, record.url);
  },

   listSubjects: async (_: any, { olid }) => {
    const url = `https://openlibrary.org/api/volumes/brief/olid/${olid}.json`;
    const res = await fetch(url);
    const data = (await res.json()) as OpenLibraryResponse;

    const recordKey = Object.keys(data.records)[0];
    if (!recordKey) return [];

    const record = data.records[recordKey];
    const subjects = record.data.subjects || [];

    return Array.from(new Map(
      subjects.map(s => [s.name, s])
    ).values());
  }
  },

  Mutation: {
   addGame(_: any, { game }: { game: any }) {
    const newGame = { id: String(Date.now()), ...game };
    db.games.push(newGame);
    return newGame;
   }
  },

};
