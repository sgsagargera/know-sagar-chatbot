const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const resumeText = fs.readFileSync(path.join(__dirname, 'data', 'resume.txt'), 'utf-8');

app.use(cors());
app.use(express.json());

// ✅ Serve static files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ API endpoint
app.post('/ask', async (req, res) => {
  const question = req.body.question;
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a chatbot for Sagar Gera. Use this resume:\n\n${resumeText}`
          },
          { role: 'user', content: question }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const answer = response.data.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error talking to bot.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
