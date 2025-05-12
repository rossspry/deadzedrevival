const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: 'https://deadzedrevival-frontend.onrender.com',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('DeadZedRevival backend is running.');
});

app.get('/api/status', (req, res) => {
  res.json({ message: 'DeadZedRevival backend is running.' });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
