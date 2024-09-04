import express, { NextFunction } from 'express';
import Container from 'typedi';
import { TodoService } from '../services/todo.service';
import asyncHandler from '../middleware/async';
import {
  TodoTitleRequiredError,
  TodoNotFoundError,
  RequestDataCannotBeEmptyError,
} from '../utils/customError';
import { TodoStatus } from '../constants';
import { ITodo } from '../models/todo.model';

const todoService = Container.get(TodoService);

export const addTodo = asyncHandler(
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    const { title, description, status } = req.body;

    if (!title) {
      return next(new TodoTitleRequiredError());
    }

    const todoData: ITodo = {
      title,
      ...(description && { description }),
      ...(status in TodoStatus && { status }),
    };

    const todo = await todoService.addNewTodo(todoData);
    return res.status(201).json({ success: true, todo });
  }
);

export const getTodos = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { status, sortBy, page = 1, limit = 10 } = req.query;

    const query: any = {};
    if (status && String(status) in TodoStatus) {
      query.status = status;
    }

    const sort: any = {};
    if (sortBy) {
      sort[String(sortBy)] = 1;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const limitValue = Number(limit);

    const todos = await todoService.fetchAllTodos(
      query,
      sort,
      skip,
      limitValue
    );
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

export const deleteTodo = asyncHandler(
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    const { id } = req.params;

    const deletedTodo = await todoService.deleteTodoById(id);

    if (!deletedTodo) {
      return next(new TodoNotFoundError());
    }

    return res
      .status(200)
      .json({ success: true, message: 'Todo deleted successfully' });
  }
);

export const updateTodo = asyncHandler(
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const todoData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(status in TodoStatus && { status }),
    };

    if (Object.keys(todoData).length === 0) {
      return next(new RequestDataCannotBeEmptyError());
    }

    const updatedTodo = await todoService.updateTodo(id, todoData);

    if (!updatedTodo) {
      return next(new TodoNotFoundError());
    }

    return res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: updatedTodo,
    });
  }
);
