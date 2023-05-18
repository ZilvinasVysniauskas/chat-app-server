import express, { Request, Response } from 'express';
import isAuth from '../../common/middleware/is-auth';
import ChatRoom, {IChatRoom} from '../models/room';
import User from '../../authorization/models/user';
import Message from '../models/message';
import * as chatController from '../controllers/chat-controller';
import multer from 'multer';


const router = express.Router();
const upload = multer();


router.post('/', isAuth, chatController.createRoom);

router.post('/:roomId/add-user', isAuth, chatController.addUserToRoom);

router.get('/:roomId', isAuth, chatController.getRoom);

router.get('/file-upload/aws-url', isAuth, chatController.getAwsUrl);

router.get('/file-get/aws-url', chatController.getAwsUrl2);

export default router;
