// Auth routes
import express from 'express';
import { RegisterUser, LoginUser } from '../controllers/authController.js';
import { loginLimiter } from '../middleware/login_limiter.js';
const router = express.Router();

// POST /api/auth/register
router.post('/register', RegisterUser);

// POST /api/auth/login
router.post('/login',loginLimiter, LoginUser);




export default router;