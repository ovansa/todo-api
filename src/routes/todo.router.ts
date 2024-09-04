import {
  addTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
} from '../controllers/todo.controller';
import express from 'express';

export default (router: express.Router): void => {
  router.route('/todo').post(addTodo).get(getTodos);
  router.route('/todo/:id').get(getTodoById).put(updateTodo).delete(deleteTodo);
};
