// app.js
import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import MemoryStore from 'session-memory-store';
import sequelize from './config/db.js';  // Import Sequelize
import authRoutes from "./routes/auth.js";
import recipeRoutes from "./routes/recipes.js";
import dayRoutes from "./routes/days.js";
import shopping_listRoute from "./routes/shopping_list.js";
import defineAssociations from './models/associations.js';
import Day from './models/Day.js'; // Import modelu użytkownika


import mysql from "mysql";
import dbConfing from "./config/db2.js";

// Connect to database
const db = mysql.createConnection(dbConfing)

db.connect((err) => {
  if (err) {
    console.error('Błąd połączenia z bazą danych:', err.message);
  } else {
    console.log('Połączono z bazą danych');
  }
});
dotenv.config();

const app = express();
const MemoryStoreInstance = MemoryStore(session);

defineAssociations();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true
}));

// Parser
app.use(bodyParser.json());
app.use(cookieParser());

// Session
app.use(session({
  store: new MemoryStoreInstance(), // Użycie pamięci podręcznej dla sesji
  secret: 'secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Ustaw na true w środowisku produkcyjnym, jeśli używasz HTTPS
    maxAge: 1000 * 60 * 60 * 24 * 7 // Okres ważności ciasteczka sesji (7 dni)
  }
}));

// Synchronizacja modeli z bazą danych
sequelize.sync()
  .then(() => {
    console.log('Połączono z bazą danych i zsynchronizowano modele.');
  })
  .catch((err) => {
    console.error('Błąd połączenia z bazą danych:', err.message);
  });

// Routes
app.use('/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/days', dayRoutes);
app.use('/api/shopping_list', shopping_listRoute);

// Check cookies
app.use((req, res, next) => {
  console.log('Received cookies:', req.cookies);
  next();
});

// Uruchamianie serwera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default db;