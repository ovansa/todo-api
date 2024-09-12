import { Model } from 'mongoose';

import Todo from '../models/todo.model';
import User from '../models/user.model';

export enum ResourceModels {
  Todo = 'Todo',
  User = 'User',
}

export const resourceModelMapping: {
  [key in ResourceModels]: Model<any>;
} = {
  [ResourceModels.Todo]: Todo,
  [ResourceModels.User]: User,
};
