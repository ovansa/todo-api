import request from 'supertest';
import status from 'http-status';
import { server } from '../../../index';
import mongoose from 'mongoose';
import Todo, { ITodoRequest } from '../../../models/todo.model';
import { TodoStatus } from '../../../constants';
import {
  clearDatabase,
  connectTestMongoDb,
  disconnectTestMongoDb,
  simulateLogin,
} from '../../helpers';
import { createDocument } from '../../data';
import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import { closeRedis } from '../../../redis';

beforeAll(() => connectTestMongoDb());

beforeEach(async () => clearDatabase());

afterAll(async () => {
  await server.close();
  await mongoose.disconnect();
  await disconnectTestMongoDb();
  await closeRedis();
});

describe('User API Tests', () => {
  describe('POST /register', () => {
    const registerEndpoint = '/register';

    it('should register a new user successfully', async () => {
      const userData = {
        email: `${faker.person.firstName()}@gmail.com`,
        password: 'Password123!',
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        username: faker.internet.userName(),
      };

      const res = await request(server)
        .post(registerEndpoint)
        .send(userData)
        .expect(status.CREATED);

      expect(res.body).toEqual(
        expect.objectContaining({
          success: true,
          token: expect.any(String),
          user: expect.objectContaining({
            email: userData.email.toLowerCase(),
            firstName: userData.firstName,
            lastName: userData.lastName,
            username: userData.username,
            role: 'default',
            _id: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        })
      );
    });

    it('should return 400 if email is already in use', async () => {
      const { userOne } = await createDocument();
      const userData = {
        email: userOne.email,
        password: 'Password123!',
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        username: faker.internet.userName(),
      };

      const res = await request(server).post(registerEndpoint).send(userData);

      expect(res.status).toBe(status.BAD_REQUEST);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch('Email address is already taken.');
    });

    it('should return 400 for invalid email format', async () => {
      const userData = {
        email: 'invalid-email-format',
        password: 'Password123!',
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        username: faker.internet.userName(),
      };

      const res = await request(server).post(registerEndpoint).send(userData);

      expect(res.status).toBe(status.BAD_REQUEST);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email format.');
    });

    it('should return 400 if required fields are missing', async () => {
      const userData = {
        email: faker.internet.email(),
        password: 'Password123!',
      };

      const response = await request(server)
        .post(registerEndpoint)
        .send(userData)
        .expect(status.BAD_REQUEST);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch('Username is required.');
    });
  });

  describe('POST /login', () => {
    it('should log in an existing user successfully', async () => {
      const { userOne } = await createDocument();

      const loginBody = {
        email: userOne.email,
        password: userOne.password,
      };

      const res = await request(server).post('/login').send(loginBody);

      expect(res.status).toBe(httpStatus.OK);

      expect(res.body).toEqual(
        expect.objectContaining({
          success: true,
          token: expect.any(String),
          user: expect.objectContaining({
            email: loginBody.email.toLowerCase(),
            firstName: userOne.firstName,
            lastName: userOne.lastName,
            username: userOne.username,
            role: 'default',
            _id: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        })
      );
    });

    it('should return 400 for incorrect email or password', async () => {
      const res = await request(server).post('/login').send({
        email: 'wrongemail@example.com',
        password: 'Password01',
      });

      expect(res.status).toBe(status.UNAUTHORIZED);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Invalid email or password.');
    });

    it('should return 400 if email or password is missing', async () => {
      const { userOne } = await createDocument();
      // Attempt to log in without email
      const resMissingEmail = await request(server).post('/login').send({
        password: userOne.password,
      });

      expect(resMissingEmail.status).toBe(status.BAD_REQUEST);
      expect(resMissingEmail.body.success).toBe(false);
      expect(resMissingEmail.body.message).toMatch('Email is required.');

      // Attempt to log in without password
      const resMissingPassword = await request(server).post('/login').send({
        email: userOne.email,
      });

      expect(resMissingPassword.status).toBe(status.BAD_REQUEST);
      expect(resMissingPassword.body.success).toBe(false);
      expect(resMissingPassword.body.message).toMatch('Password is required.');
    });
  });
});
