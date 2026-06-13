const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const STATE_FILE = path.join(__dirname, 'state.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Leer estado
app.get('/state', (req, res) => {
  try {
    if (!fs.existsSync(STATE_FILE)) {
      return res.json({ states: {}, comments: {} });
    }
    const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    res.json(data);
  } catch (e) {
    res.json({ states: {}, comments: {} });
  }
});

// Guardar estado
app.post('/state', (req, res) => {
  try {
    const { states, comments } = req.body;
    if (!states || !comments) {
      return res.status(400).json({ error: 'Payload inválido' });
    }
    fs.writeFileSync(STATE_FILE, JSON.stringify({ states, comments }, null, 2));
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'No se pudo guardar' });
  }
});

app.listen(PORT, () => {
  console.log(`Tierra Adentro Tracker corriendo en puerto ${PORT}`);
});
