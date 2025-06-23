const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

// Add a root route to avoid 404s
app.get('/', (req, res) => {
  res.send('NBA proxy is live');
});

app.get('/playerdatatotals', async (req, res) => {
  const { season, page } = req.query;
  if (!season || !page) return res.status(400).json({ error: 'Missing params' });

  try {
    const response = await fetch(`http://rest.nbaapi.com/api/PlayerDataTotals/query?season=${season}&pageSize=100&pageNumber=${page}`);
    if (response.status === 404) return res.status(404).json([]);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
