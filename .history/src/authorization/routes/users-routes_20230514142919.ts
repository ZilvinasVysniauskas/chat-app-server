import express from 'express';
import * as userController from '../controllers/auth-controller';
import { check } from 'express-validator';
import { bcryptHash } from '../middleware/bcrypt';
import { validateEmail, validatePassword, validatePasswordRepeat } from '../middleware/validators';

const router = express.Router();

router.post('/register', [
    validateEmail,
    validatePassword,
    va
    ],
     userController.createUser);

router.post('/login', [
    validateEmail,
    validatePassword
], userController.login);

export default router;