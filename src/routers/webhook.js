import { Router } from 'express';
import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { webHookAuth } from '../controllers/auth.js';

export const router = Router();
const jsonParser = express.json({ type: 'application/json' });
const urlencodedParser = express.urlencoded({ extended: true });

router.post('/', jsonParser, urlencodedParser, ctrlWrapper(webHookAuth));

export default router;
