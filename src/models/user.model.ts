import mongoose, { HydratedDocument } from 'mongoose';

import { UserRoles } from '../constants';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  role?: UserRoles;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IUserMethods {
  matchPassword(enteredPassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

export type UserDocument = HydratedDocument<IUser, IUserMethods>;

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

UserSchema.pre('save', async function (this: UserDocument, next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (this: UserDocument, enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.generateAuthToken = function (this: UserDocument) {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET || '', {
    expiresIn: process.env.JWT_EXPIRE || '10d',
  });
};

export default mongoose.model<UserDocument>('User', UserSchema);
