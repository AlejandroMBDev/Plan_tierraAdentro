const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const API = `${SUPABASE_URL}/rest/v1/tracker_state`;

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Leer estado
app.get('/state', async (req, res) => {
  try {
    const r = await fetch(`${API}?id=eq.1`, { headers });
    const data = await r.json();
    if (!data.length) return res.json({ states: {}, comments: {} });
    res.json({ states: data[0].states, comments: data[0].comments });
  } catch (e) {
    res.json({ states: {}, comments: {} });
  }
});

// Guardar estado
app.post('/state', async (req, res) => {
  try {
    const { states, comments } = req.body;
    if (!states || !comments) {
      return res.status(400).json({ error: 'Payload inválido' });
    }
    await fetch(`${API}?id=eq.1`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ states, comments })
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'No se pudo guardar' });
  }
});

app.listen(PORT, () => {
  console.log(`Tierra Adentro Tracker corriendo en puerto ${PORT}`);
});