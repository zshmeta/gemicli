import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../data/.env') });

const genAI = new GoogleGenerativeAI({
  apiKey: process.env.API_KEY,
});

const model = () => ({
  model: process.env.MODEL,
});

export { model, genAI };
