import { UserDocument } from '../models/user.model';
import { omit } from 'lodash';
import validator from 'validator';

const sanitizeUser = (user: UserDocument) => {
  const sanitizedUser = user.toJSON();

  if (sanitizedUser.email) {
    sanitizedUser.email =
      validator.normalizeEmail(sanitizedUser.email, { gmail_remove_dots: false }) ||
      sanitizedUser.email;
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
