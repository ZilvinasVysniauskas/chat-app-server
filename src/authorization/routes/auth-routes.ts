import express from 'express';
import * as userController from '../controllers/auth-controller';
import { bcryptHash } from '../middleware/bcrypt';
import { validateRequestBody, validateRequestBodyAsync } from '../../common/middleware/joi-validate';
import { loginSchema, registrationSchema } from '../validators/validators';

const router = express.Router();

router.post('/register', [
    validateRequestBodyAsync(registrationSchema),
    bcryptHash
], userController.createUser);

router.post('/login', [
    validateRequestBody(loginSchema)
], userController.login);

export default router;