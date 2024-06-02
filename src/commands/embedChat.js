import  { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, '../config/.env') });

const { API_KEY } = process.env;

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function embedChat( text ) {
  // For embeddings, use the embedding-001 model
  const model = genAI.getGenerativeModel({ model: "embedding-001"});

  const vector = text

  const result = await model.embedContent(vector);
  const embedding = result.embedding;
  console.log(embedding.values);
}

export { embedChat };