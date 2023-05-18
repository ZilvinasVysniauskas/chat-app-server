import mongoose from 'mongoose';
import app from './src/index';
import { createSocketConnection } from './src/messages/utils/socket-connection';
import './src/messages/sockets/message-sockets'
import { configureMessageSockets } from './src/messages/sockets/message-sockets';


const port: string = process.env.PORT || '3000';
const mongoDBConnectionString: string = process.env.MONGODB_CONNECTION_STRING ||
  'mongodb+srv://test_user:Test123@cluster0.cfmd8.mongodb.net/';


mongoose.connect(mongoDBConnectionString)
  .then(() => {
    console.log('Connected to MongoDB');
    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    const io = createSocketConnection(server);
    configureMessageSockets(io);

  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });

