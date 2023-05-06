import { Router } from 'express';
const router = Router();


router.get('/vars', (req, res) => {
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
    console.log('DB_NAME:', process.env.DB_NAME);
});

export default router;