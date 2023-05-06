
import app from './src/index';

const port: string = process.env.PORT || '3000';
app.listen(port, () => console.log(`Server listening on port ${port}`));