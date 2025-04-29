import User, { IUser, UserDocument } from '../models/user.model';

import { Service } from 'typedi';

export interface UserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
  role?: string;
}

@Service()
export class UserService {
  public async addUser(values: UserInput): Promise<UserDocument> {
    return await User.create(values);
  }

  public async getUsers(): Promise<IUser[]> {
    return User.find();
  }

  public async getUserByEmail(email: string): Promise<UserDocument | null> {
    return User.findOne({ email });
  }

  public async getUserById(id: string): Promise<UserDocument | null> {
    return User.findById(id);
  }
}
