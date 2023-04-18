import { Router } from "express";
import { signUp,
    login, 
    logout,  
    verifyEmail
} from '../controllers/auth.js';
import { is_auth } from '../middleware/is_auth.js';

const router = Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/verify/:emailToken', verifyEmail);
router.post('/logout', is_auth, logout);


export { router };