// server/server.js
const express = require('express');

// Tworzenie instancji aplikacji Express
const app = express();

// Middleware dla parsowania JSON (opcjonalnie)
app.use(express.json());

// Prosta trasa testowa
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the API' });
});

// Przykład trasy z parametrami
app.get('/api/hello/:name', (req, res) => {
  const name = req.params.name;
  res.json({ message: `Hello, ${name}!` });
});

// Uruchamianie serwera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
