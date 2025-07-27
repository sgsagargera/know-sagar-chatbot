const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Fallback in case resume.txt is missing
let resumeText = 'Resume content not available.';
try {
  resumeText = fs.readFileSync(path.join(__dirname, 'data', 'resume.txt'), 'utf-8');
} catch (error) {
  console.warn('⚠️ Could not load resume.txt:', error.message);
}

app.use(cors());
app.use(express.json());

// ✅ Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Chat API route using OpenRouter
app.post('/ask', async (req, res) => {
  const question = req.body.question;
  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',  // ✅ Corrected model name
        messages: [
          {
            role: 'system',
            content: `You are a chatbot representing Sagar Gera. Use the following resume content to answer questions:\n\n${resumeText}`
          },
          { role: 'user', content: question }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const answer = response.data.choices[0].message.content;
    res.json({ answer });

  } catch (error) {
    if (error.response) {
      console.error('❌ OpenRouter API Error:', {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error('❌ No response received from OpenRouter:', error.request);
    } else {
      console.error('❌ Error setting up request to OpenRouter:', error.message);
    }
    res.status(500).json({ error: 'Error talking to bot.' });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
