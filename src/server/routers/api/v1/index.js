import { Router } from 'express';
import todoRouter from './todo';

const router = new Router();

router.use('/todoList', todoRouter);

export default router;