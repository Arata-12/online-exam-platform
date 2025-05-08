// Teacher routes
import express from 'express';
import { getTeacherDashboard , getTeacherProfile, updateTeacherProfile, getTeacherExams, getExamStudents, getTeacherResults}  from '../controllers/teacherController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
const router = express.Router();
router.get('/dashboard', verifyToken,getTeacherDashboard);
router.get('/profile', verifyToken, getTeacherProfile);
router.put('/profile', verifyToken, updateTeacherProfile);
router.get('/exams', verifyToken, getTeacherExams);
router.get('/exam-students', verifyToken, getExamStudents);
router.get('/results', verifyToken, getTeacherResults);
export default router;