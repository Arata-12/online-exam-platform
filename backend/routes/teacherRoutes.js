// Teacher routes
import express from 'express';
import { getTeacherDashboard , getTeacherProfile, updateTeacherProfile}  from '../controllers/teacherController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
const router = express.Router();
router.get('/dashboard', verifyToken,getTeacherDashboard);
router.get('/profile', verifyToken, getTeacherProfile);
router.put('/profile', verifyToken, updateTeacherProfile);
export default router;