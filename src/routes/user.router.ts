import protect from '../middleware/authenticate';
import {
  getAllUsers,
  loginUser,
  registerUser,
} from '../controllers/user.controller';
import express from 'express';
import validateResource from '../middleware/validateResource';
import { loginUserSchema, registerUserSchema } from '../schema/user.schema';

export default (router: express.Router): void => {
  router
    .route('/register')
    .get(protect, getAllUsers)
    .post(validateResource(registerUserSchema), registerUser);
  router.route('/login').post(validateResource(loginUserSchema), loginUser);
};
