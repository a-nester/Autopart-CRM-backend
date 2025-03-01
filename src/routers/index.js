import { Router } from 'express';
import webHookRouter from '../routers/webhook.js';
import authRouter from '../routers/auth.js';
import contactsRouter from '../routers/contacts.js';
import timersRouter from '../routers/timers.js';
import transportRouter from '../routers/transport.js';

const router = Router();

router.use('/webhook', webHookRouter);
router.use('/auth', authRouter);
router.use('/contacts', contactsRouter);
router.use('/timers', timersRouter);
router.use('/transport', transportRouter);

export default router;
