import { Router } from 'express';
import webHookRouter from '../routers/webhook.js';
import authRouter from '../routers/auth.js';
import contactsRouter from '../routers/contacts.js';

const router = Router();

router.post('/webhook', webHookRouter);
router.use('/auth', authRouter);
router.use('/contacts', contactsRouter);

export default router;
