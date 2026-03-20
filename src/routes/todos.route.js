import { Router } from 'express';
import {
  createTodo,
  deleteTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
} from '#controllers/todos.controller';

import { requireAuth } from '#middleware/requireAuth';

export const todosRouter = Router();

todosRouter.get('/', requireAuth, getAllTodos);
todosRouter.get('/:id', requireAuth, getTodoById);
todosRouter.post('/', requireAuth, createTodo);
todosRouter.patch('/:id', requireAuth, updateTodo);
todosRouter.delete('/:id', requireAuth, deleteTodo);
