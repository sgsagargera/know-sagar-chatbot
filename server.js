const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo", // or gpt-4
      messages: [{ role: "user", content: message }],
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({ bot: response.data.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI error:", error?.response?.data || error.message);
    res.status(500).json({ bot: "Error talking to bot." });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running...');
});
