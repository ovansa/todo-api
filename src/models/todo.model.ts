import { TodoStatus } from '../constants';
import mongoose from 'mongoose';

export interface ITodoRequest {
  title: string;
  description?: string;
  status?: TodoStatus;
  createdBy?: string;
}

export interface ITodo extends mongoose.Document {
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: mongoose.Schema.Types.ObjectId;
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
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITodo>('Todo', TodoSchema);

/**
 * username
 * password
 * email
 * full name
 * enabled
 * disabled
 * tasks
 */
