import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import mysql from "mysql";
import authRoutes from "./routes/auth.js";
import recipeRoutes from "./routes/recipes.js";
import dayRoutes from "./routes/days.js";
import dbConfing from "./config/db.js";
import dotenv from 'dotenv';
import MemoryStore from 'session-memory-store';



dotenv.config();

const app = express();
const MemoryStoreInstance = MemoryStore(session);
// Middleware
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["POST", "GET", "PUT"],
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

// Connect to database
const db = mysql.createConnection(dbConfing)

db.connect((err) => {
  if (err) {
    console.error('Błąd połączenia z bazą danych:', err.message);
  //   return res.status(500).json({ error: 'Błąd połączenia z bazą danych' });
  } else {
    console.log('Połączono z bazą danych');
  }
});

// Routes
app.use('/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/days', dayRoutes);

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

