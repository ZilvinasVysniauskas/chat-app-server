import express from 'express';
import * as userController from '../controllers/users-controller';

const router = express.Router();

router.post('/', userController.createUser);

router.get('/:id', userController.getUserById);

export default router;