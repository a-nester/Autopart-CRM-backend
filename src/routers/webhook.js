import { Router } from 'express';
import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper';
import { webHookAuth } from '../controllers/auth';

export const router = Router();
const jsonParser = express.json();

router.post('/webhook', jsonParser, ctrlWrapper(webHookAuth));

export default router;
