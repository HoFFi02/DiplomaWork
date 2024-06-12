// server/server.js
const express = require('express');
require('dotenv').config(); // Ładowanie zmiennych środowiskowych z pliku .env

const mysql = require('mysql');

// Utworzenie połączenia z bazą danych
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// Nawiązanie połączenia
connection.connect((err) => {
  if (err) {
    console.error('Błąd połączenia z bazą danych:', err);
    return;
  }
  console.log('Połączenie z bazą danych zostało nawiązane');
});
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
