const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Fallback in case resume.txt is missing
let resumeText = 'Resume content not available.';
try {
  resumeText = fs.readFileSync(path.join(__dirname, 'data', 'resume.txt'), 'utf-8');
} catch (error) {
  console.warn('⚠️ Could not load resume.txt:', error.message);
}

// ✅ Setup OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json());

// ✅ Serve static frontend files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Chat API route
app.post('/ask', async (req, res) => {
  const question = req.body.question;
  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a chatbot representing Sagar Gera. Use the following resume content to answer questions:\n\n${resumeText}`
        },
        { role: 'user', content: question }
      ]
    });

    const answer = response.choices[0].message.content;
    res.json({ answer });

  } catch (error) {
    console.error('❌ OpenAI Error:', error.message);
    res.status(500).json({ error: 'Error talking to bot.' });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
