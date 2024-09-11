import request from 'supertest';
import status from 'http-status';
import { server } from '../../../index';
import mongoose from 'mongoose';
import Todo, { ITodo, ITodoRequest } from '../../../models/todo.model';
import { TodoStatus } from '../../../constants';
import {
  clearDatabase,
  connectTestMongoDb,
  disconnectTestMongoDb,
  loginUser,
  simulateLogin,
} from '../../helpers';
import { createDocument } from '../../data';

beforeAll(() => connectTestMongoDb());

beforeEach(async () => clearDatabase());

afterAll(async () => {
  await server.close();
  await mongoose.disconnect();
  await disconnectTestMongoDb();
});

describe('Todo API Integration Tests', () => {
  describe.only('POST /todos', () => {
    it('should create a new todo with valid data', async () => {
      const { userOne } = await createDocument();
      const token = await simulateLogin(userOne);

      const requestBody: ITodoRequest = {
        title: 'Test Todo',
        description: 'This is a test todo',
      };

      const res = await request(server)
        .post('/todo')
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody);

      expect(res.statusCode).toEqual(status.CREATED);
      expect(res.body.todo).toHaveProperty('_id');
      expect(res.body.todo.title).toBe(requestBody.title);
      expect(res.body.todo.description).toBe(requestBody.description);
    });

    it('should create a new todo with only a title', async () => {
      const { userOne } = await createDocument();
      const token = await simulateLogin(userOne);

      const requestBody: ITodoRequest = {
        title: 'Title Only Todo',
      };
      const res = await request(server)
        .post('/todo')
        .send(requestBody)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(status.CREATED);
      expect(res.body.todo).toHaveProperty('_id');
      expect(res.body.todo.title).toBe(requestBody.title);
      expect(res.body.todo.description).toBeUndefined();
    });

    it('should return a 400 error when title is missing', async () => {
      const { userOne } = await createDocument();
      const token = await simulateLogin(userOne);

      const requestBody = {
        description: 'No title provided',
      };
      const res = await request(server)
        .post('/todo')
        .send(requestBody)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(status.BAD_REQUEST);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Todo title is required.');
    });

    it('should return a 400 error when title is empty', async () => {
      const { userOne } = await createDocument();
      const token = await simulateLogin(userOne);

      const requestBody: ITodoRequest = {
        title: '',
        description: 'Empty title',
      };
      const res = await request(server)
        .post('/todo')
        .send(requestBody)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(status.BAD_REQUEST);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Todo title is required.');
    });

    it('should ignore additional unexpected fields', async () => {
      const { userOne } = await createDocument();
      const token = await simulateLogin(userOne);

      const requestBody: any = {
        title: 'Test Todo with Extras',
        description: 'This is a test todo',
        extraField: 'This should be ignored',
      };
      const res = await request(server)
        .post('/todo')
        .send(requestBody)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(status.CREATED);
      expect(res.body.todo).toHaveProperty('_id');
      expect(res.body.todo.title).toBe(requestBody.title);
      expect(res.body.todo.description).toBe(requestBody.description);
      expect(res.body.todo).not.toHaveProperty('extraField');
    });
  });

  describe('GET /todos', () => {
    it('should fetch all todos', async () => {
      await createDocument();

      const res = await request(server).get('/todo');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should fetch only todos with a specific status', async () => {
      const status = TodoStatus.DRAFT;
      await createDocument();

      const res = await request(server).get(`/todo?status=${status}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
      res.body.forEach((todo: ITodoRequest) => {
        expect(todo.status).toEqual(status);
      });
    });

    it('should fetch todos with pagination', async () => {
      await createDocument();

      const page = 1;
      const limit = 10;
      const res = await request(server).get(
        `/todo?page=${page}&limit=${limit}`
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeLessThanOrEqual(limit);
    });

    it('should fetch only the top n todos', async () => {
      const limit = 5;
      const res = await request(server).get(`/todo?limit=${limit}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeLessThanOrEqual(limit);
    });
  });

  describe('GET /todos/:id', () => {
    it('should fetch a todo by ID', async () => {
      const { todoOne } = await createDocument();

      const res = await request(server).get(`/todo/${todoOne._id}`);

      expect(res.statusCode).toEqual(200);
      expect(String(res.body._id)).toBe(String(todoOne._id));
      expect(res.body.title).toBe(todoOne.title);
      expect(res.body.description).toBe(todoOne.description);
    });

    it('should return 404 for a non-existent todo', async () => {
      await createDocument();
      const res = await request(server).get(
        `/todo/${new mongoose.Types.ObjectId()}`
      );

      expect(res.statusCode).toEqual(status.NOT_FOUND);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Todo not found.');
    });

    it('should return 400 for an invalid ID format', async () => {
      await createDocument();
      const res = await request(server).get('/todo/invalid-id-format');

      expect(res.statusCode).toEqual(status.BAD_REQUEST);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Invalid ID format.');
    });

    it('should return 200 and a todo with all properties', async () => {
      const { todoOne } = await createDocument();
      const res = await request(server).get(`/todo/${todoOne._id}`);

      expect(res.statusCode).toEqual(status.OK);
      expect(res.body).toHaveProperty('title');
      expect(res.body).toHaveProperty('description');
      expect(res.body).toHaveProperty('status');
      // expect(res.body).toHaveProperty('created_by');
    });
  });

  describe('PUT /todos/:id', () => {
    it('should update a todo by ID', async () => {
      const { todoOne } = await createDocument();
      const todoDataForUpdate = {
        title: 'Updated Test Todo',
        description: 'This is an updated test todo description',
      };

      const res = await request(server)
        .put(`/todo/${todoOne._id}`)
        .send(todoDataForUpdate);

      expect(res.statusCode).toEqual(status.OK);
      expect(res.body.message).toBe('Todo updated successfully.');
      expect(res.body.data.title).toBe(todoDataForUpdate.title);
    });

    it('should return 404 if todo is not found', async () => {
      const invalidTodoId = new mongoose.Types.ObjectId();
      const todoDataForUpdate = {
        title: 'Nonexistent Todo',
        description: 'This todo does not exist',
      };

      const res = await request(server)
        .put(`/todo/${invalidTodoId}`)
        .send(todoDataForUpdate);

      expect(res.statusCode).toEqual(status.NOT_FOUND);
      expect(res.body.error).toBe('Todo not found.');
    });

    it('should not update a todo if no fields are provided', async () => {
      const { todoOne } = await createDocument();

      const res = await request(server).put(`/todo/${todoOne._id}`).send({});

      expect(res.statusCode).toEqual(status.BAD_REQUEST);
      expect(res.body.error).toBe('Request data cannot be empty.');
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should delete a todo by ID', async () => {
      const { todoOne } = await createDocument();

      const res = await request(server).delete(`/todo/${todoOne._id}`);

      expect(res.statusCode).toEqual(status.OK);
      expect(res.body.success).toBeTruthy();
      expect(res.body.message).toBe('Todo successfully deleted.');

      const todoExist = await Todo.findById(todoOne._id);
      expect(todoExist).toBeNull();
    });

    it('should return 404 if todo does not exist', async () => {
      await createDocument();
      const nonExistentId = new mongoose.Types.ObjectId().toHexString();

      const res = await request(server).delete(`/todo/${nonExistentId}`);

      expect(res.statusCode).toEqual(status.NOT_FOUND);
      expect(res.body.success).toBeFalsy();
      expect(res.body.error).toBe('Todo not found.');
    });

    it('should return 400 for invalid ID format', async () => {
      const invalidId = 'invalid_id';

      const res = await request(server).delete(`/todo/${invalidId}`);

      expect(res.statusCode).toEqual(status.BAD_REQUEST);
      expect(res.body.success).toBeFalsy();
      expect(res.body.error).toBe('Invalid ID format.');
    });
  });
});
