import Todo from '../models/todo.model';

import { generateTodo } from './mock-generator';

const createData = async () => {
  const todoOne = generateTodo();
  const todoTwo = generateTodo();
  const todoThree = generateTodo();

  return {
    todoOne,
    todoTwo,
    todoThree,
  };
};

export const createDocument = async () => {
  const { todoOne, todoTwo, todoThree } = await createData();

  await Todo.create([todoOne, todoTwo, todoThree]);

  return {
    todoOne,
    todoTwo,
    todoThree,
  };
};
