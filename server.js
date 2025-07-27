const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ Serve static frontend files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Catch-all route to send index.html for frontend routes
const fs = require('fs');

// Catch-all route, but exclude requests for existing files
app.get('*', (req, res) => {
  const requestedPath = path.join(__dirname, 'public', req.path);
  if (fs.existsSync(requestedPath)) {
    return res.sendFile(requestedPath);
  } else {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});


app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
