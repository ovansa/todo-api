import { FilterQuery, SortOrder } from 'mongoose';
import { Service } from 'typedi';

import { TodoStatus } from '../constants';
import Todo, { ITodo } from '../models/todo.model';

interface TodoInput {
  title: string;
  description?: string;
  status?: TodoStatus;
}

@Service()
export class TodoService {
  public async addNewTodo(values: TodoInput): Promise<ITodo> {
    return await Todo.create(values);
  }

  public async fetchTodoById(todoId: string): Promise<ITodo | null> {
    return Todo.findById(todoId);
  }

  public async fetchAllTodos(
    query: FilterQuery<ITodo> = {},
    sort: Record<string, SortOrder> = {},
    skip: number = 0,
    limit: number = 10,
  ): Promise<ITodo[]> {
    return Todo.find(query).sort(sort).skip(skip).limit(limit).lean<ITodo[]>().exec();
  }

  public async deleteTodoById(todoId: string): Promise<ITodo | null> {
    return Todo.findByIdAndDelete(todoId);
  }

  public async updateTodo(todoId: string, values: TodoInput): Promise<ITodo | null> {
    return Todo.findByIdAndUpdate(todoId, values, { new: true });
  }
}
