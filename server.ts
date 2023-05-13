import mongoose from 'mongoose';
import app from './src/index';
import cors from 'cors';
import { Server } from 'http';


const port: string = process.env.PORT || '3000';

mongoose.connect('mongodb+srv://test_user:Test123@cluster0.cfmd8.mongodb.net/').then(result => {
  const server: Server = app.listen(port);
}).catch(err => console.log(err));
