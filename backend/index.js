const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check route for frontend
app.get('/api/status', (req, res) => {
  res.json({ message: 'DeadZedRevival backend is running.' });
});

// Optional root route
app.get('/', (req, res) => {
  res.send('DeadZedRevival backend is running.');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
