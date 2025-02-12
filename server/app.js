import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import MemoryStore from 'session-memory-store';
import sequelize from './config/db.js';  
import authRoutes from "./routes/auth.js";
import recipeRoutes from "./routes/recipes.js";
import dayRoutes from "./routes/days.js";
import productRoutes from "./routes/products.js";
import shopping_listRoute from "./routes/shopping_list.js";
import defineAssociations from './models/associations.js';


const app = express();
const MemoryStoreInstance = MemoryStore(session);

defineAssociations();

// Middleware
app.use(express.json());
const allowedOrigins = ["http://localhost:5173", "http://192.168.100.6:5173"];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true
}));

// Parser
app.use(bodyParser.json());
app.use(cookieParser());

// Session
app.use(session({
  store: new MemoryStoreInstance(), 
  secret: 'secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, 
    maxAge: 1000 * 60 * 60 * 24 * 7 
  }
}));

// Connection
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
app.use('/api/products', productRoutes);

// Check cookies
app.use((req, res, next) => {
  console.log('Received cookies:', req.cookies);
  next();
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

export default sequelize;