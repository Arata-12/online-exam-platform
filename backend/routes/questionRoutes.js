// Question routes
import express from 'express';
import { addQuestion, updateQuestionById, deleteQuestionById } from '../controllers/questionController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to add question to an exam
router.post('/:examId/questions/add', verifyToken, addQuestion);

// Update question
router.put('/:questionId/update', verifyToken, updateQuestionById);

// Delete question
router.delete('/:questionId/delete', verifyToken, deleteQuestionById);


export default router;
