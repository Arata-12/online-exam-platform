// Student routes
import express from 'express';
import { startExam, saveAnswer, submitExam , fetchStudentResult, getStudentExams, initiateExam, getExamQuestions} from '../controllers/studentExamController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();
// show exams of student
router.get('/exams-list', verifyToken, getStudentExams);
// Student link exam
router.post('/start', verifyToken, startExam);
// starting exam
router.post('/:examId/start', verifyToken, initiateExam);
router.get('/exams/:examId/questions', verifyToken, getExamQuestions);
router.post('/saveanswer', verifyToken, saveAnswer);
// submit exam
router.post('/submit', verifyToken, submitExam);
// fetch student result
router.get('/result/:student_exam_id', verifyToken, fetchStudentResult);
export default router;
