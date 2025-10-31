import DataLoader from "dataloader";
import { books } from "../data/bookData.js";

async function batchBooksById(ids) {
  console.log("Batch loading books for IDs:", ids);
  return ids.map((id) => books.find((b) => b.id === id) || null);
}

export const createBookLoader = () => new DataLoader(batchBooksById);
