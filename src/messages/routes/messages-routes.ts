import express from 'express';
import isAuth from '../../common/middleware/is-auth';

const router = express.Router();

router.get('/test', isAuth, (req, res) => {
    console.log("validated");
});

export default router;