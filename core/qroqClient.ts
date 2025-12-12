import Groq from "groq-sdk";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config({ path: ".env.local" });
export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// this doesn't make sense, I know... btw bytez is slow as hell, I'd recommend using groq
export const client2 = new OpenAI({
  apiKey: process.env.BYTEZ_API_KEY!,
  baseURL: "https://api.bytez.com/models/v2/openai/v1",
  defaultHeaders: {
    Authorization: process.env.BYTEZ_API_KEY!,
  },
});

export const client3 = new OpenAI({
  apiKey: process.env.GITHUB_AI_TOKEN,
  baseURL: "https://models.github.ai/inference",
});
