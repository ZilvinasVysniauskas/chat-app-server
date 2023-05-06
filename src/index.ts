import express, { Application } from 'express';
import userRoutes from './routes/users-routes';
import testEnv from './test/test-to-delete';

const app: Application = express();
app.use(express.json());
app.use('/users', userRoutes);

app.use('/test', testEnv)

export default app;