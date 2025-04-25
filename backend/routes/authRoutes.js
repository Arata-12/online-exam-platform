// Auth routes
import express from 'express';
import { RegisterUser, LoginUser } from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', RegisterUser);

// POST /api/auth/login
router.post('/login', LoginUser);


export default router;