import express from 'express';
import * as userController from '../controllers/auth-controller';
import { check } from 'express-validator';
import { bcryptHash } from '../middleware/bcrypt';
import { validateEmail } from '../middleware/validators';

const router = express.Router();

router.post('/register', [
    ...validateRegistrationRequest,
     bcryptHash
    ],
     userController.createUser);

router.post('/login', [
    validateEmail
], userController.login);

export default router;