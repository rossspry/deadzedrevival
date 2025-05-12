const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// ✅ Expanded CORS config to avoid fetch failures
app.use(cors({
  origin: true, // allow any origin during dev
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// ✅ Health check route
app.get('/api/status', (req, res) => {
  res.json({ message: 'DeadZedRevival backend is running.' });
});

// ✅ Root route
app.get('/', (req, res) => {
  res.send('DeadZedRevival backend is running.');
});

// ✅ Debug route
app.get('/debug', (req, res) => {
  res.send('This is the live index.js being served by Render.');
});

// ✅ Main race route
app.post('/run-race', (req, res) => {
  const { horses } = req.body;

  if (!Array.isArray(horses) || horses.length < 2) {
    return res.status(400).json({ error: 'At least two horses are required to run a race.' });
  }

  const winnerIndex = Math.floor(Math.random() * horses.length);
  const winner = horses[winnerIndex];

  res.json({
    message: 'Race completed.',
    participants: horses,
    winner
  });
});

// ✅ Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
