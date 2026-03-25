import { Router } from 'express';
import { loginUser, logoutUser, registerUser } from '#controllers/auth.controller';
import { requireAuth } from '#middleware/requireAuth';

export const authRouter = Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.delete('/logout', requireAuth, logoutUser);
