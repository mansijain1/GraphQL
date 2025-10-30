import dotenv from "dotenv";
import { startServer } from "./server.js";
import path from "node:path";

startServer();
dotenv.config({ path: path.resolve(process.cwd(), ".env") });