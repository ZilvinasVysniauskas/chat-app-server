const express = require('express');
const exampleRouter = require('./src/routes/exampleRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/test', exampleRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});