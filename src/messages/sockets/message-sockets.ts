import { Server, Socket } from 'socket.io';
import { saveMessage } from '../services/chat-service';
import { isAuthorized } from '../../common/middleware/is-auth';
import { MessageRequest } from '../models/message';


export function configureMessageSockets(io: Server) {
    io.on('connection', (socket: Socket) => {

        socket.on('joinRoom', (roomName: string) => {
            socket.join(roomName);
            console.log('joined room ' + roomName);
        });

        socket.on('sendToRoom', (messageRequest: MessageRequest) => {
            if (isAuthorized(socket)) {
                try {

                    saveMessage({
                        roomId: messageRequest.roomId,
                        message: messageRequest.message,
                        sender: messageRequest.sender,
                        savedFileId: messageRequest.savedFileId
                    });
                    socket.to(messageRequest.roomId).emit('message', messageRequest.message);
                    console.log('message sent to room ' + messageRequest.roomId);
                    console.log(messageRequest);
                } catch (error) {
                    console.error(error);
                }
            }
        });
    });
}
