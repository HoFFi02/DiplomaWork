import express from 'express';
import { registerUser, loginUser, logoutUser, getSession } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/session', getSession);

export default router;
