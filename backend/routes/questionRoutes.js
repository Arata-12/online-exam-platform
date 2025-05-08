// Question routes
import express from 'express';
import { addQuestion, updateQuestionById, deleteQuestionById , getExamQuestions, fetchQuestionWithAnswers} from '../controllers/questionController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js'

const router = express.Router();

// Route to add question to an exam
router.post('/:examId/questions/add', verifyToken, upload.single('media'), addQuestion);
// Route to get questions for an exam
router.get('/:examId/questions', verifyToken, getExamQuestions);
// Route to get a specific question with full answers to edit
router.get('/:questionId/questionwithanswers', verifyToken, fetchQuestionWithAnswers);
// Update question
router.put('/:questionId/update', verifyToken, updateQuestionById);

// Delete question
router.delete('/:questionId/delete', verifyToken, deleteQuestionById);


export default router;
