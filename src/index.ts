import express, { Application } from 'express';
import authRoutes from './authorization/routes/auth-routes';
import chatRoutes from './messages/routes/chat-routes';

const app: Application = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/chat-room', chatRoutes);

export default app;