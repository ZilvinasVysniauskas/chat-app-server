import express, { Application } from 'express';
import userRoutes from './authorization/routes/auth-routes';
import messagesRoutes from './messages/routes/messages-routes';

const app: Application = express();

app.use(express.json());
app.use('/users', userRoutes);
app.use('/messages', messagesRoutes);

export default app;