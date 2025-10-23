import { RESTDataSource } from "@apollo/datasource-rest";
import { Listing } from "../types";

export class ListingAPI extends RESTDataSource {
  
  baseURL = "https://rt-airlock-services-listing.herokuapp.com/";
  
  constructor(options: { cache: any }) {
    super(options);
  }

  async getFeaturedListings(): Promise<Listing[]> {
    return this.get<Listing[]>("featured-listings");
  }

  async getListingById(id: string): Promise<Listing> {
    return this.get<Listing>(`listings/${id}`);
  }

}
