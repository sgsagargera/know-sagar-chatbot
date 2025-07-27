const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to index.html for any root request
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve cv.html explicitly
app.get('/cv', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cv.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
