import { Service } from 'typedi';

import User, { IUser } from '../models/user.model';

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
  public async addUser(values: UserInput): Promise<IUser> {
    return await User.create(values);
  }

  public async getUsers(): Promise<IUser[]> {
    return User.find();
  }

  public async getUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  public async getUserById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }
}
