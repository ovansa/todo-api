import express, { NextFunction } from 'express';
import httpStatus from 'http-status';
import Container from 'typedi';

import { TodoStatus } from '../constants';
import asyncHandler from '../middleware/async';
import { ITodoRequest } from '../models/todo.model';
import { TodoService } from '../services/todo.service';
import {
  TodoTitleRequiredError,
  TodoNotFoundError,
  RequestDataCannotBeEmptyError,
  UnauthorizedError,
} from '../utils/customError';

const todoService = Container.get(TodoService);

export const addTodo = asyncHandler(
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    const { title, description, status } = req.body;

    if (!title) {
      return next(new TodoTitleRequiredError());
    }

    const userId = req?.user?._id;
    if (!userId) return next(new UnauthorizedError());

    const todoData: ITodoRequest = {
      title,
      ...(description && { description }),
      ...(status in TodoStatus && { status }),
      createdBy: String(userId),
    };

    const todo = await todoService.addNewTodo(todoData);
    return res.status(httpStatus.CREATED).json({ success: true, todo });
  },
);

export const getTodos = asyncHandler(async (req: express.Request, res: express.Response) => {
  const { status, sortBy, page = 1, limit = 10, createdByMe = true } = req.query;

  const query: any = {};
  if (status && String(status) in TodoStatus) {
    query.status = status;
  }

  if (createdByMe && req.user) {
    query.createdBy = req.user._id;
  }

  const sort: any = {};
  if (sortBy) {
    sort[String(sortBy)] = 1;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const limitValue = Number(limit);

  const todos = await todoService.fetchAllTodos(query, sort, skip, limitValue);
  return res.status(httpStatus.OK).json(todos).end();
});

export const getTodoById = asyncHandler(
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    const { id } = req.params;
    const todo = await todoService.fetchTodoById(id);
    if (!todo) {
      return next(new TodoNotFoundError());
    }

    return res.status(httpStatus.OK).json(todo).end();
  },
);

export const deleteTodo = asyncHandler(
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    const { id } = req.params;

    const todo = await todoService.fetchTodoById(id);
    if (!todo) {
      return next(new TodoNotFoundError());
    }

    const deletedTodo = await todoService.deleteTodoById(id);
    if (!deletedTodo) {
      return next(new TodoNotFoundError());
    }

    return res.status(httpStatus.OK).json({ success: true, message: 'Todo successfully deleted.' });
  },
);

export const updateTodo = asyncHandler(
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const todo = await todoService.fetchTodoById(id);
    if (!todo) {
      return next(new TodoNotFoundError());
    }

    const todoData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(Object.values(TodoStatus).includes(status) && { status }),
    };

    if (Object.keys(todoData).length === 0) {
      return next(new RequestDataCannotBeEmptyError());
    }

    const updatedTodo = await todoService.updateTodo(id, todoData);

    if (!updatedTodo) {
      return next(new TodoNotFoundError());
    }

    return res.status(httpStatus.OK).json({
      success: true,
      message: 'Todo updated successfully.',
      data: updatedTodo,
    });
  },
);
