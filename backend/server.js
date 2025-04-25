// Express server setup
import express, { Router } from 'express';
// load .env!
import './config/dotenv.js';
// connect to MySQL!
import db from './config/db.js'; 
// create tables if not exists!
import { initDatabase } from './utils/initDB.js';
initDatabase();
// setup routes register + login
import authRoutes from './routes/authRoutes.js';

const app = express();

// Parse JSON
app.use(express.json());

app.use('/api/auth', authRoutes)

app.get('/', (req,res) => {
    res.send(` landing page working ...`)
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`view on http://localhost:${PORT}/`);
});