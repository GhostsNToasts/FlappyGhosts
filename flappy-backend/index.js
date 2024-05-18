const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

let scores = [];

app.post('/score', (req, res) => {
  const { name, score } = req.body;
  console.log(`Received score submission: ${name} - ${score}`);
  scores.push({ name, score });
  scores.sort((a, b) => b.score - a.score); // Sort by score in descending order
  res.sendStatus(200);
});

app.get('/leaderboard', (req, res) => {
  res.json(scores.slice(0, 10)); // Return top 10 scores
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
