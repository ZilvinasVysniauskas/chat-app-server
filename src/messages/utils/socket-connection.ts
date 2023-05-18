import { Server } from 'socket.io';

export function createSocketConnection(server: any): Server {
  return require('socket.io')(server, {
    cors: {
      origin: 'http://localhost:4200',
      methods: ['GET', 'POST'],
    },
  });
}