import express from 'express';
import * as userController from '../controllers/auth-controller';
import { bcryptHash } from '../middleware/bcrypt';
import { emailExists, validateEmail, validatePassword, validatePasswordRepeat, validateUsername } from '../middleware/validators';

const router = express.Router();

router.post('/register', [
    validateEmail,
    emailExists,
    validatePassword,
    validatePasswordRepeat,
    validateUsername,
    bcryptHash
], userController.createUser);

router.post('/login', [
    validateEmail,
    validatePassword
], userController.login);

export default router;