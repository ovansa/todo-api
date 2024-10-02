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
import { updateTodoSchema } from '../schema/todo.schema';
import validateResource from '../middleware/validateResource';

export default (router: express.Router): void => {
  router.route('/todo').post(protect, addTodo).get(protect, getTodos);
  router
    .route('/todo/:id')
    .get(protect, isOwner(ResourceModels.Todo), getTodoById)
    .put(validateResource(updateTodoSchema), protect, isOwner(ResourceModels.Todo), updateTodo)
    .delete(protect, isOwner(ResourceModels.Todo), deleteTodo);
};
