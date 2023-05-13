import mongoose from 'mongoose';
import app from './src/index';


const port: string = process.env.PORT || '3000';
const mongoDBConnectionString: string = process.env.MONGODB_CONNECTION_STRING ||
  'mongodb+srv://test_user:Test123@cluster0.cfmd8.mongodb.net/';


mongoose.connect(mongoDBConnectionString)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });