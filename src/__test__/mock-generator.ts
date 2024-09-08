import mongoose from 'mongoose';
import { ITodo } from '../models/todo.model.js';

import { faker } from '@faker-js/faker';
import { TodoStatus } from '../constants';

export const generateTodo = (overrides?: Partial<ITodo>): ITodo => {
  const todoData: ITodo = {
    _id: new mongoose.Types.ObjectId(),
    title: faker.lorem.words(3),
    description: faker.lorem.sentence(10),
    status: TodoStatus.DRAFT,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as ITodo;

  Object.entries(overrides || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      (todoData[key as keyof ITodo] as any) = value;
    }
  });

  return todoData;
};
