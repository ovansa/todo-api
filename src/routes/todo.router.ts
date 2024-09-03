import { addTodo, getTodos, getTodoById } from '../controllers/todo.controller';
import express from 'express';

export default (router: express.Router) => {
  router.post('/todo', addTodo);
  router.get('/todo', getTodos);
  router.get('/todo/:id', getTodoById);
};
