import protect from '../middleware/authenticate';
import {
  getAllUsers,
  loginUser,
  registerUser,
} from '../controllers/user.controller';
import express from 'express';

export default (router: express.Router): void => {
  router.route('/user').get(protect, getAllUsers).post(registerUser);
  router.route('/login').post(loginUser);
};
