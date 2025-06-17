import { Router } from 'express';
import { login, getMe, forgotPassword, resetPassword } from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.get('/me', auth, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router; 