import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { ChatGroq } from "@langchain/groq";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HF_API_KEY,
});

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant",
  temperature: 0
});

let docs = []; // in-memory store

// 🔹 Upload text
app.post("/upload", async (req, res) => {
  const { text } = req.body;

  const chunks = text.match(/.{1,200}/g) || [];

  docs = [];

  for (let chunk of chunks) {
    const emb = await embeddings.embedQuery(chunk);
    docs.push({ chunk, emb });
  }

  res.json({ message: "Stored!" });
});

// 🔹 Ask question
app.post("/ask", async (req, res) => {
  const { question } = req.body;

  const queryEmb = await embeddings.embedQuery(question);

  // cosine similarity
  const scored = docs.map(d => {
    const score = d.emb.reduce((acc, val, i) => acc + val * queryEmb[i], 0);
    return { ...d, score };
  });

  const top = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const context = top.map(t => t.chunk).join("\n");

  const response = await llm.invoke([
    {
      role: "system",
      content: "Answer only using the provided context"
    },
    {
      role: "user",
      content: `Context:\n${context}\n\nQuestion: ${question}`
    }
  ]);

  res.json({ answer: response.content });
});

app.listen(5000, () => console.log("Server running on port 5000"));