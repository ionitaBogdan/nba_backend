const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

const API_BASE = 'http://rest.nbaapi.com/api/PlayerDataTotals/query';

app.get('/playerdatatotals', async (req, res) => {
    const season = req.query.season;
    const page = req.query.page;

    if (!season || !page) {
        return res.status(400).json({ error: 'Missing season or page parameter' });
    }

    const apiUrl = `${API_BASE}?season=${season}&pageSize=100&pageNumber=${page}`;

    try {
        const response = await fetch(apiUrl);
        if (response.status === 404) {
            return res.status(404).json([]);
        }
        if (!response.ok) {
            return res.status(response.status).json({ error: 'API request failed' });
        }
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('Proxy Error:', err);
        res.status(500).json({ error: 'Proxy server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});