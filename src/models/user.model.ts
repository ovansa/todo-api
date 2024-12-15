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

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (
  this: IUser,
  userPassword: string,
): Promise<boolean> {
  return bcrypt.compare(userPassword, this.password);
};

// UserSchema.methods.matchPassword = async function (userPassword: string): Promise<boolean> {
//   const user = this as IUser;

//   return bcrypt.compare(userPassword, user.password);
// };

UserSchema.methods.generateAuthToken = function (this: IUser): string {

  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET || '', {
    expiresIn: process.env.JWT_EXPIRE || '10d',
  });
};

export default mongoose.model<IUser>('User', UserSchema);
