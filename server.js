import express from 'express';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Servir frontend
app.use(express.static(path.join(process.cwd(), 'public')));

// Endpoint general
app.get('/api', async (req, res) => {
  const url = decodeURIComponent(req.query.url);

  if (!url) {
    return res.status(400).json({ error: 'Falta parámetro url' });
  }
  try {
    const fetchUrl = `${url}&appid=${process.env.API_KEY}`;
    const response = await fetch(fetchUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
