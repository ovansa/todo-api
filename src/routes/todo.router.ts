import express from 'express';

import {
  addTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
} from '../controllers/todo.controller';
import protect, { isOwner } from '../middleware/authenticate';
import { ResourceModels } from '../utils/resourceModel';

export default (router: express.Router): void => {
  router.route('/todo').post(protect, addTodo).get(protect, getTodos);
  router
    .route('/todo/:id')
    .get(protect, isOwner(ResourceModels.Todo), getTodoById)
    .put(protect, isOwner(ResourceModels.Todo), updateTodo)
    .delete(protect, isOwner(ResourceModels.Todo), deleteTodo);
};
