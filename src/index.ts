import express, { Application } from 'express';
import userRoutes from './authorization/routes/users-routes';
import messagesRoutes from './messages/routes/messages-routes';
import { execSync } from 'child_process';

const app: Application = express();
app.use(express.json());
app.use('/users', userRoutes);
app.use('/messages', messagesRoutes);

export default app;