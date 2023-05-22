import { Server, Socket } from 'socket.io';
import { saveMessage } from '../services/chat-service';
import { isAuthorized } from '../../common/middleware/is-auth';
import { MessageRequest, MessageResponse } from '../models/message';
import { messageRequestSchema } from '../validators/validators';
import { getFileUrl } from '../services/aws-service';


export function configureMessageSockets(io: Server) {
    io.on('connection', (socket: Socket) => {

        socket.on('joinRoom', (roomName: string) => {
            socket.join(roomName);
            console.log('joined room ' + roomName);
        });

        socket.on('sendToRoom', async (messageRequest: MessageRequest) => {
            if (isAuthorized(socket)) {
                try {
                    const message: MessageRequest = {
                        roomId: messageRequest.roomId,
                        message: messageRequest.message,
                        sender: messageRequest.sender,
                        savedFileId: messageRequest.savedFileId,
                        fileKey: messageRequest.fileKey,
                    }
                    const { error } = messageRequestSchema.validate(message);

                    if (error) {
                        throw new Error(error.message);
                    }

                    saveMessage(message);

                    if (messageRequest.savedFileId) {
                        const messageToSend: MessageResponse = {
                            message: messageRequest.message,
                            file: {
                                fileName: messageRequest.savedFileId,
                                url: await getFileUrl(message.fileKey!)
                            },
                            createdAt: new Date()
                        }
                        socket.to(messageRequest.roomId).emit('message', messageToSend);
                        return;
                    }
                    const messageToSend: MessageResponse = {
                        message: messageRequest.message,
                        createdAt: new Date()
                    }
                    socket.to(messageRequest.roomId).emit('message', messageToSend);
                } catch (error) {
                    console.error(error);
                }
            }
        });

        socket.on('changeVideoState', (videoState: string) => {
            console.log(videoState);
            socket.to('646907ab6c3802ad2cc4ccb9').emit('videoState', videoState);
        });

        socket.on('changeVideoTimestamp', (videoTimestamp: number) => {
            console.log(videoTimestamp);
            socket.to('646907ab6c3802ad2cc4ccb9').emit('videoTimestamp', videoTimestamp);
        });
    });
}