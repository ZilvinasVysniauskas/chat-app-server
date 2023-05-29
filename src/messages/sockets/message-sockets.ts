import { Server, Socket } from 'socket.io';
import { saveMessage } from '../services/chat-service';
import { isAuthorized } from '../../common/middleware/is-auth';
import { MessageRequest, MessageResponse } from '../models/message';
import { messageRequestSchema } from '../validators/validators';
import { getFileUrl } from '../services/aws-service';
import { Sockets } from '../constants';


export function configureMessageSockets(io: Server) {
    io.on(Sockets.connect, (socket: Socket) => {

        socket.on(Sockets.joinRoom, (roomName: string) => {
            socket.join(roomName);
            console.log('joined room ' + roomName);
        });

        socket.on(Sockets.message, async (messageRequest: MessageRequest) => {
            if (isAuthorized(socket)) {
                try {
                    const message: MessageRequest = {
                        roomId: messageRequest.roomId,
                        message: messageRequest.message,
                        sender: messageRequest.sender ?? '646914bdea206f829f7212a7',
                        savedFileId: messageRequest.savedFileId,
                        fileKey: messageRequest.fileKey,
                    }
                    const { error } = messageRequestSchema.validate(message);

                    if (error) {
                        throw new Error(error.message);
                    }

                    const savedMessage = await saveMessage(message);

                    if (messageRequest.savedFileId) {
                        const messageToSend: MessageResponse = {
                            id: savedMessage._id,
                            sender: messageRequest.sender,
                            text: savedMessage.message,
                            file: {
                                fileName: messageRequest.savedFileId,
                                url: await getFileUrl(message.fileKey!)
                            },
                            createdAt: new Date()
                        }
                        socket.to(messageRequest.roomId).emit(Sockets.message, messageToSend);
                        return;
                    }
                    const messageToSend: MessageResponse = {
                        id: savedMessage._id.toString(),
                        sender: messageRequest.sender,
                        text: savedMessage.message,
                        createdAt: new Date()
                    }
                    socket.to(messageRequest.roomId).emit(Sockets.message, messageToSend);
                    console.log('message sent', messageToSend);
                } catch (error) {
                    console.error(error);
                }
            }
        });

        socket.on(Sockets.videoState, (videoState: string) => {
            console.log(videoState);
            socket.broadcast.to('646907ab6c3802ad2cc4ccb9').emit(Sockets.videoState, videoState);
        });

        socket.on(Sockets.videoTimestamp, (videoTimestamp: number) => {
            console.log(videoTimestamp);
            socket.to('646907ab6c3802ad2cc4ccb9').emit(Sockets.videoTimestamp, videoTimestamp);
        });
    });
}