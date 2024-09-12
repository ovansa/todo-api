import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { UserRoles } from '../constants';

export interface IUser extends mongoose.Document {
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  role?: UserRoles;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: false },
    // verified: { type: Boolean, default: false },
    role: { type: String, enum: UserRoles, default: UserRoles.DEFAULT_USER },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

UserSchema.pre('save', async function (next) {
  const user = this as IUser;

  if (!user.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hashSync(user.password, salt);

  user.password = hash;
  return next();
});

UserSchema.methods.matchPassword = async function (userPassword: string): Promise<boolean> {
  const user = this as IUser;

  return bcrypt.compare(userPassword, user.password);
};

UserSchema.methods.generateAuthToken = function (): string {
  const user = this as IUser;

  return jwt.sign({ _id: user._id }, process.env.JWT_SECRET || '', {
    expiresIn: process.env.JWT_EXPIRE || '10d',
  });
};

export default mongoose.model<IUser>('User', UserSchema);
