// Express server setup
import express, { Router } from 'express';
import cors from 'cors';
// load .env!
import './config/dotenv.js';
// connect to MySQL!
import db from './config/db.js'; 
// create tables if not exists!
import { initDatabase } from './utils/initDB.js';
initDatabase();
// setup routes register + login
import authRoutes from './routes/authRoutes.js';
// setup routes for create exam + add questions with update & delete
import examRoutes from './routes/examRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import studentExamRoutes from './routes/studentExamRoutes.js';
// setup routes for teacher dashboard
import getTeacherDashboard from './routes/teacherRoutes.js';
import { getTeacherProfile, updateTeacherProfile ,getTeacherResults, getExamStudents} from './controllers/teacherController.js';
// setup routes for student profile
import { getStudentProfile, updateStudentProfile } from './controllers/studentcontroller.js';

const app = express();

// CORS setup
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
// Parse JSON
app.use(express.json());

app.use('/api/auth', authRoutes)
app.use('/api/exams', examRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/student', studentExamRoutes, getStudentProfile, updateStudentProfile);
app.use('/api/teacher', getTeacherDashboard, getTeacherProfile, updateTeacherProfile, getTeacherResults, getExamStudents);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(`view on http://localhost:${PORT}/`);
});