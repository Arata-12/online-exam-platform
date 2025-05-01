// Student routes
import express from 'express';
import { startExam, saveAnswer, submitExam , fetchStudentResult} from '../controllers/studentExamController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Student start exam by access code
router.post('/start', verifyToken, startExam);
router.post('/answer', verifyToken, saveAnswer);
router.post('/submit', verifyToken, submitExam);
router.get('/result/:student_exam_id', verifyToken, fetchStudentResult);
export default router;
