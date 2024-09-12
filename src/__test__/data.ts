import Todo from '../models/todo.model';
import User from '../models/user.model';

import { generateTodo, generateUser } from './mock-generator';

const createData = async () => {
  const userOne = generateUser();
  const userTwo = generateUser();
  const userThree = generateUser();

  const todoOne = generateTodo({ createdBy: String(userOne._id) });
  const todoTwo = generateTodo();
  const todoThree = generateTodo();

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
  const { todoOne, todoTwo, todoThree, userOne, userTwo, userThree } = await createData();

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
