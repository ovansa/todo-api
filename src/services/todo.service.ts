import { Service } from 'typedi';

import Todo, { ITodo } from '../models/todo.model';

interface TodoInput {
  name: string;
}

@Service()
export class TodoService {
  public async addNewTodo(values: TodoInput): Promise<ITodo> {
    return Todo.create(values);
  }

  public async fetchTodoById(todoId: string): Promise<ITodo> {
    return Todo.findById(todoId);
  }

  public async fetchAllTodos(): Promise<ITodo[]> {
    return Todo.find();
  }
}

// export default TodoModel = mongoose.model('Todo', TodoSchema);

// export const addNewTodo = (todoDetails: Record<string, any>) =>
//   new TodoModel(todoDetails).save().then((savedTodo) => savedTodo.toObject());

// export const removeTodoById = (todoId: string) =>
//   TodoModel.findByIdAndDelete(todoId);

// export const fetchAllTodos = () => TodoModel.find();

// export const fetchTodoById = (todoId: string) => TodoModel.findById(todoId);

// export const modifyTodoById = (
//   todoId: string,
//   updatedValues: Record<string, any>
// ) => TodoModel.findByIdAndUpdate(todoId, updatedValues);
