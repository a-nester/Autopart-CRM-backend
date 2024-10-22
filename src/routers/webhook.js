import { Router } from 'express';
import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { webHookAuth } from '../controllers/auth.js';

export const router = Router();
const jsonParser = express.json();

router.post('/webhook', jsonParser, ctrlWrapper(webHookAuth));

export default router;
