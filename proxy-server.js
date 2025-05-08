const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());

const CHEAPSHARK_BASE = 'https://www.cheapshark.com/api/1.0';

app.get('/api/deals', async (req, res) => {
  try {
    const response = await axios.get(`${CHEAPSHARK_BASE}/deals`, { params: req.query });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

app.get('/api/games', async (req, res) => {
  try {
    const response = await axios.get(`${CHEAPSHARK_BASE}/games`, { params: req.query });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

app.get('/api/deal', async (req, res) => {
  try {
    const response = await axios.get(`${CHEAPSHARK_BASE}/deals`, { params: req.query });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch deal info' });
  }
});

app.get('/api/stores', async (req, res) => {
  try {
    const response = await axios.get(`${CHEAPSHARK_BASE}/stores`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`)); 