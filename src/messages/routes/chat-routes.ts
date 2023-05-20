import express from 'express';
import isAuth from '../../common/middleware/is-auth';
import * as chatController from '../controllers/chat-controller';
import * as fileController from '../controllers/file-controller';
import { validateGetRoomRequest } from '../middleware/validators';


const router = express.Router();

router.post('/', isAuth, chatController.createRoom);

router.post('/:roomId/add-user', isAuth, chatController.addUserToRoom);

router.get('/:roomId', isAuth, chatController.getRoom);

router.get('/:roomId/messages', [
    isAuth, 
    validateGetRoomRequest
], chatController.getMessagesByRoomId);

router.post('/files', isAuth, fileController.saveFileMetadataAndGetUrl);


export default router;
