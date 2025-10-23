import { Resolvers } from "./types";

export const resolvers: Resolvers = {
  Query: {
    featuredListings: async (_, __, { dataSources }) => {
      return dataSources.listingAPI.getFeaturedListings();
    },
    
    listingById: async(_, { id }, { dataSources }) => {
      return dataSources.listingAPI.getListingById(id);
    }
  }
};