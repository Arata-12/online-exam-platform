// student routes
import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getStudentProfile, updateStudentProfile } from '../controllers/studentcontroller.js';
const router = express.Router();

router.get('/profile', verifyToken, getStudentProfile);
router.put('/profile', verifyToken, updateStudentProfile);
export default router;