const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// ✅ Expanded CORS config for development
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// ✅ Health check
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

// ✅ Trait-based race route (private logic)
app.post('/run-race', (req, res) => {
  const { horseIds } = req.body;

  if (!Array.isArray(horseIds) || horseIds.length < 2 || horseIds.length > 6) {
    return res.status(400).json({ error: 'You must select between 2 and 6 horses.' });
  }

  const horsesRaw = JSON.parse(fs.readFileSync(path.join(__dirname, 'horses.json'), 'utf8'));
  const scoredHorses = [];

  horseIds.forEach(id => {
    const horse = horsesRaw[id];
    if (!horse) return;

    const realName = horse.realName || horse.name || `Horse #${id}`;
    const wins = horse.numberOfWins || 0;
    const races = horse.numberOfRaces || 0;

    const stats = {
      speed: 5 + wins,
      stamina: 5 + races * 0.5,
      luck: Math.floor(Math.random() * 5) + 1
    };

    const score = stats.speed * 1.5 + stats.stamina * 1.2 + (Math.random() * stats.luck);

    scoredHorses.push({
      id,
      realName,
      score
    });
  });

  if (scoredHorses.length < 2) {
    return res.status(400).json({ error: 'Invalid or missing horse IDs.' });
  }

  scoredHorses.sort((a, b) => b.score - a.score);
  const winner = scoredHorses[0];

  res.json({
    message: 'Race completed.',
    winner: winner.realName,
    participants: scoredHorses.map(h => h.realName)
  });
});

// ✅ Start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
