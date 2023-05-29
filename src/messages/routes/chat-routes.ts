import express from 'express';
import isAuth from '../../common/middleware/is-auth';
import * as chatController from '../controllers/chat-controller';
import * as fileController from '../controllers/file-controller';
import { validate } from 'class-validator';
import { validateRequestBody, validateRequestQuery } from '../../common/middleware/joi-validate';
import { addUserToRoomSchema, createRoomSchema, getMessagesSchema } from '../validators/validators';


const router = express.Router();

router.post('/', [
    isAuth,
    validateRequestBody(createRoomSchema)
], chatController.createRoom);

router.post('/:roomId/add-user', [
    isAuth,
    validateRequestBody(addUserToRoomSchema)
], chatController.addUserToRoom);

router.get('/',
    isAuth,
    chatController.getRoom);

router.get('/:roomId/messages', [
    isAuth,
    validateRequestQuery(getMessagesSchema)
], chatController.getMessagesByRoomId);

router.post('/files', [
    isAuth,
], fileController.saveFileMetadataAndGetUrl);


export default router;
