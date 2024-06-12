import dbConfing from "./config/db.js";
import mysql from "mysql";
import express from "express";
import session from 'express-session';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import cors from "cors";
// server/server.js
//const express = require('express');

dotenv.config();
// Utworzenie połączenia z bazą danych
const db = mysql.createConnection(dbConfing)

// Nawiązanie połączenia
db.connect((err) => {
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
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["POST", "GET"],
  credentials: true
}));


//session
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Ustaw na true przy HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 godziny
    }
  }));
  

// Prosta trasa testowa
app.use('/auth', authRoutes);

// Uruchamianie serwera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default db;