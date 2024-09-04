import { TodoStatus } from '../constants';
import mongoose from 'mongoose';

export interface ITodo {
  title: string;
  description?: string;
  status?: TodoStatus;
  // created_by: mongoose.Schema.Types.ObjectId;
}

const TodoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    status: {
      type: String,
      enum: Object.values(TodoStatus),
      default: TodoStatus.DRAFT,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Todo', TodoSchema);

/**
 * username
 * password
 * email
 * full name
 * enabled
 * disabled
 * tasks
 */
