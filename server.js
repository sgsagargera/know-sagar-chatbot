const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

app.post('/ask', async (req, res) => {
  try {
    const { prompt } = req.body;
    // dummy test response
    res.json({ response: `Echo: ${prompt}` });
  } catch (error) {
    console.error('Error in /ask:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

