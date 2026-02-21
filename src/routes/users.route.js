import { Router } from 'express';
import { getAllUsers, getMe } from '#controllers/users.controller';

export const usersRouter = Router();

usersRouter.get('/', getAllUsers);
usersRouter.get('/me', getMe);
