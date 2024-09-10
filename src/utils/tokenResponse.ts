import User from '../models/user.model';
import { Response } from 'express';
import sanitizeUser from './sanitizeUser';

export const sendTokenResponse = (
  user: InstanceType<typeof User>,
  statusCode: number,
  res: Response,
  message?: string
) => {
  const token = user.generateAuthToken();
  const cookie_expire = parseInt(process.env.JWT_COOKIE_EXPIRE || '10', 10);
  const sanitizedUser = sanitizeUser(user);

  const options = {
    expires: new Date(Date.now() + cookie_expire * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  const responseBody = {
    success: true,
    token,
    user: sanitizedUser,
    ...(message && { message }),
  };

  return res
    .status(statusCode)
    .cookie('token', token, options)
    .json(responseBody);
};
