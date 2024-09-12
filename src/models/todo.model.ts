import mongoose from 'mongoose';

import { TodoStatus } from '../constants';

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
  createdBy: string;
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
  },
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
