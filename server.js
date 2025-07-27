const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ OpenAI Setup
const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

// ✅ Read and Chunk Resume
let resumeChunks = [];
try {
  const resumeText = fs.readFileSync(path.join(__dirname, 'data', 'resume.txt'), 'utf-8');
  const chunkSize = 500;
  for (let i = 0; i < resumeText.length; i += chunkSize) {
    resumeChunks.push(resumeText.slice(i, i + chunkSize));
  }
} catch (err) {
  console.error('Could not load resume.txt:', err.message);
}

// ✅ Get Embedding Helper
async function getEmbedding(text) {
  const response = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input: text,
  });
  return response.data.data[0].embedding;
}

// ✅ Cosine Similarity Helper
function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (normA * normB);
}

// ✅ Endpoint
app.post('/ask', async (req, res) => {
  const question = req.body.question;
  try {
    const questionEmbedding = await getEmbedding(question);

    // Find the most relevant chunk
    const similarities = await Promise.all(
      resumeChunks.map(async (chunk) => {
        const chunkEmbedding = await getEmbedding(chunk);
        return cosineSimilarity(questionEmbedding, chunkEmbedding);
      })
    );

    const bestChunkIndex = similarities.indexOf(Math.max(...similarities));
    const context = resumeChunks[bestChunkIndex];

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: `You are a resume bot for Sagar Gera. Answer questions based on this resume chunk:\n\n${context}` },
        { role: 'user', content: question },
      ],
    });

    const answer = response.data.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Error talking to bot.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
