import { Router } from 'express';
import { getAllUsers, getMe } from '#controllers/users.controller';
import { requireAuth } from '#middleware/requireAuth';

export const usersRouter = Router();

usersRouter.get('/', requireAuth, getAllUsers);
usersRouter.get('/me', requireAuth, getMe);
