import mongoose from 'mongoose';
import { ITodo } from '../models/todo.model.js';

import { faker } from '@faker-js/faker';
import { TodoStatus } from '../constants';
import { IUser } from '../models/user.model.js';

export const generateTodo = (overrides?: Partial<ITodo>): ITodo => {
  const todoData: ITodo = {
    _id: new mongoose.Types.ObjectId(),
    title: faker.lorem.words(3),
    description: faker.lorem.sentence(10),
    status: TodoStatus.DRAFT,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: String(new mongoose.Types.ObjectId()),
  } as ITodo;

  Object.entries(overrides || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      (todoData[key as keyof ITodo] as any) = value;
    }
  });

  return todoData;
};

export const generateUser = (overrides?: Partial<IUser>): IUser => {
  const userData: IUser = {
    _id: new mongoose.Types.ObjectId(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    username: faker.internet.userName(),
    createdAt: new Date(),
    updatedAt: new Date(),
  } as IUser;

  Object.entries(overrides || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      (userData[key as keyof IUser] as any) = value;
    }
  });

  return userData;
};
