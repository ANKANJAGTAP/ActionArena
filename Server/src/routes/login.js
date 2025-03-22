import express from 'express';
import cors from 'cors';
import login from '../controllers/login.js';


const router = express.Router();

router.use(cors());
router.post('/login', login);

export default router;
