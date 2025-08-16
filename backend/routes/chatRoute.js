import express from 'express';
import {chatMessage} from '../controller/chat.js'

const router = express.Router();

router.post("/aichat",chatMessage);


export default router;