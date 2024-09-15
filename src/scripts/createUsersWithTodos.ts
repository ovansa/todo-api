import { faker } from '@faker-js/faker';
import User, { IUser } from '../models/user.model';
import { TodoStatus, UserRoles } from '../constants';
import Todo, { ITodo } from '../models/todo.model';
import logger from '../utils/logger';

const noOfUsers = 15;
const noOfTasks = 20;

const generateUserData = (): Partial<IUser> => {
  const firstName = faker.person.firstName().toLowerCase();
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    username: firstName,
    email: `${firstName}@gmail.com`,
    role: UserRoles.DEFAULT_USER,
    password: 'Password0123$',
  };
};

const generateTodoData = (userId: string): Partial<ITodo> => ({
  title: `Eat ${faker.food.dish()}`,
  description: 'Description of eating food',
  status: TodoStatus.DRAFT,
  createdBy: userId,
});

const createUsersWithTodos = async () => {
  const firstThreeUsers: { email: string; password: string }[] = [];

  try {
    for (let i = 0; i < noOfUsers; i++) {
      const userData = generateUserData();
      const user = await User.create(userData);

      if (i < 3) {
        // Store email and password of the first 3 users
        firstThreeUsers.push({ email: user.email, password: userData.password as string });
      }

      const todosData = Array.from({ length: noOfTasks }, () => generateTodoData(String(user._id)));
      await Todo.insertMany(todosData);
    }

    logger.info(`✅ Successfully created ${noOfUsers} users and their todos.`);
    logger.info(
      `Details of the first 3 users: ${JSON.stringify(JSON.stringify(firstThreeUsers, null, 2))}`,
    );
  } catch (error) {
    logger.error('❌ Error occurred during user or todo creation:', error);
  }
};

export default createUsersWithTodos;
