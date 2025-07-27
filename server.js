const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/cv', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cv.html'));
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
      }),
    });

    const data = await response.json();
    const botReply = data.choices?.[0]?.message?.content || 'Sorry, I could not respond.';
    res.json({ reply: botReply });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
