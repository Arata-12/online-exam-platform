// Exam routes

import express from 'express';
import { createExam , updateExamById, deleteExamById} from '../controllers/examController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create Exam route (protected by JWT)
router.post('/create', verifyToken, createExam);

// Update exam
router.put('/:examId/update', verifyToken, updateExamById);

// Delete exam
router.delete('/:examId/delete', verifyToken, deleteExamById);

export default router;
