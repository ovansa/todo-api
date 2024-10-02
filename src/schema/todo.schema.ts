import { TodoStatus } from '../constants';
import * as yup from 'yup';

export const updateTodoSchema = yup.object({
  body: yup.object({
    title: yup.string().optional(), // Title is optional during update
    description: yup.string().optional(), // Description is also optional
    status: yup.string().optional().oneOf(Object.values(TodoStatus), 'Invalid status value.'), // Optional but must match valid enum values
  }),
});
