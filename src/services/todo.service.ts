import { Service } from 'typedi';

import Todo, { ITodo } from '../models/todo.model';
import { TodoStatus } from '../constants';

interface TodoInput {
  title: string;
  description?: string;
  status?: TodoStatus;
}

@Service()
export class TodoService {
  public async addNewTodo(values: TodoInput): Promise<ITodo> {
    return Todo.create(values);
  }

  public async fetchTodoById(todoId: string): Promise<ITodo> {
    return Todo.findById(todoId);
  }

  public async fetchAllTodos(
    query: any = {},
    sort: any = {},
    skip = 0,
    limit = 10
  ): Promise<ITodo[]> {
    return Todo.find(query).sort(sort).skip(skip).limit(limit).exec();
  }

  public async deleteTodoById(todoId: string): Promise<ITodo | null> {
    return Todo.findByIdAndDelete(todoId);
  }

  public async updateTodo(todoId: string, values: TodoInput): Promise<ITodo> {
    return Todo.findByIdAndUpdate(todoId, values);
  }
}
