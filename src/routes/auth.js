import { Router } from "express";
import { signUp,
    login, 
    logout, 
    resetPassword, 
    verifyEmail,
    forgotPassword  } from '../controllers/auth.js';

const router = Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.post('/verify/:emailToken', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/logout', logout);


export { router };