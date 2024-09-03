import express, { NextFunction } from 'express';
import Container from 'typedi';
import { TodoService } from '../services/todo.service';
import asyncHandler from '../middleware/async';
import { TodoNameRequiredError, TodoNotFoundError } from '../utils/customError';

const todoService = Container.get(TodoService);

export const addTodo = asyncHandler(
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    const { name } = req.body;

    if (!name) {
      return next(new TodoNameRequiredError());
    }

    const todo = await todoService.addNewTodo({ name });
    return res.status(201).json({ success: true, todo });
  }
);

export const getTodos = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const todos = await todoService.fetchAllTodos();
    return res.status(200).json(todos).end();
  }
);

export const getTodoById = asyncHandler(
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    const { id } = req.params;
    const todo = await todoService.fetchTodoById(id);

    if (!todo) {
      return next(new TodoNotFoundError());
    }

    return res.status(200).json(todo).end();
  }
);
