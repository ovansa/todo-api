import { IUser } from '../models/user.model';
import { omit } from 'lodash';
import validator from 'validator';

const sanitizeUser = (user: IUser) => {
  const sanitizedUser = user.toJSON();

  if (sanitizedUser.email) {
    sanitizedUser.email =
      validator.normalizeEmail(sanitizedUser.email) || sanitizedUser.email;
  }

  if (sanitizedUser.firstName) {
    sanitizedUser.firstName = validator.escape(sanitizedUser.firstName);
  }

  if (sanitizedUser.lastName) {
    sanitizedUser.lastName = validator.escape(sanitizedUser.lastName);
  }

  if (sanitizedUser.username) {
    sanitizedUser.username = validator.escape(sanitizedUser.username);
  }

  return omit(sanitizedUser, 'password');
};

export default sanitizeUser;
