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
                saveMessage({
                        roomId: messageRequest.roomId,
                        content: messageRequest.content,
                        sender: messageRequest.sender,
                        type: messageRequest.type
                    });
                socket.to(messageRequest.roomId).emit('message', messageRequest.content);
                console.log('message sent to room ' + messageRequest.roomId);
                console.log(messageRequest);
            }
        });
    });
}
