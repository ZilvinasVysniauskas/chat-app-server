import express from 'express';
import * as userController from '../controllers/auth-controller';
import { check } from 'express-validator';
import { bcryptHash } from '../middleware/bcrypt';

const router = express.Router();

router.post('/register', [
    ...validateRegistrationRequest,
     bcryptHash
    ],
     userController.createUser);

router.post('/login', [
    validateE
], userController.login);

export default router;