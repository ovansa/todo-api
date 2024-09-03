import mongoose from 'mongoose';

export interface ITodo extends mongoose.Document {
  name: string;
  isDone: boolean;
}

const TodoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isDone: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Todo', TodoSchema);
