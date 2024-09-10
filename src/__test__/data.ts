import Todo from '../models/todo.model';
import User from '../models/user.model';

import { generateTodo, generateUser } from './mock-generator';

const createData = async () => {
  const todoOne = generateTodo();
  const todoTwo = generateTodo();
  const todoThree = generateTodo();

  const userOne = generateUser();
  const userTwo = generateUser();
  const userThree = generateUser();

  return {
    todoOne,
    todoTwo,
    todoThree,
    userOne,
    userTwo,
    userThree,
  };
};

export const createDocument = async () => {
  const { todoOne, todoTwo, todoThree, userOne, userTwo, userThree } =
    await createData();

  await Todo.create([todoOne, todoTwo, todoThree]);
  await User.create([userOne, userTwo, userThree]);

  return {
    todoOne,
    todoTwo,
    todoThree,
    userOne,
    userTwo,
    userThree,
  };
};
