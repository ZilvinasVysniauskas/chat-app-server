import express from 'express';
import * as userController from '../controllers/auth-controller';

const router = express.Router();

router.post('/', userController.createUser);

try {
    router.post('/login', userController.login);
} catch (error) {
    console.error(error);
}


export default router;