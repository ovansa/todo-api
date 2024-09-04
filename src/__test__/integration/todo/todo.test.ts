import request from 'supertest';
import status from 'http-status';
import { server } from '../../../index';
import mongoose from 'mongoose';
import { ITodo } from '../../../models/todo.model';
import { TodoStatus } from '../../../constants';

afterAll(async () => {
  await server.close();
  await mongoose.disconnect();
});

describe('Todo API Integration Tests', () => {
  let todoId: string;

  describe('POST /todos', () => {
    it('should create a new todo with valid data', async () => {
      const requestBody: ITodo = {
        title: 'Test Todo',
        description: 'This is a test todo',
      };
      const res = await request(server).post('/todo').send(requestBody);

      expect(res.statusCode).toEqual(status.CREATED);
      expect(res.body.todo).toHaveProperty('_id');
      expect(res.body.todo.title).toBe(requestBody.title);
      expect(res.body.todo.description).toBe(requestBody.description);
    });

    it('should create a new todo with only a title', async () => {
      const requestBody: ITodo = {
        title: 'Title Only Todo',
      };
      const res = await request(server).post('/todo').send(requestBody);

      expect(res.statusCode).toEqual(status.CREATED);
      expect(res.body.todo).toHaveProperty('_id');
      expect(res.body.todo.title).toBe(requestBody.title);
      expect(res.body.todo.description).toBeUndefined();
    });

    it('should return a 400 error when title is missing', async () => {
      const requestBody: Partial<ITodo> = {
        description: 'No title provided',
      };
      const res = await request(server).post('/todo').send(requestBody);

      expect(res.statusCode).toEqual(status.BAD_REQUEST);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Todo title is required.');
    });

    it('should return a 400 error when title is empty', async () => {
      const requestBody: ITodo = {
        title: '',
        description: 'Empty title',
      };
      const res = await request(server).post('/todo').send(requestBody);

      expect(res.statusCode).toEqual(status.BAD_REQUEST);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Todo title is required.');
    });

    it('should ignore additional unexpected fields', async () => {
      const requestBody: any = {
        title: 'Test Todo with Extras',
        description: 'This is a test todo',
        extraField: 'This should be ignored',
      };
      const res = await request(server).post('/todo').send(requestBody);

      expect(res.statusCode).toEqual(status.CREATED);
      expect(res.body.todo).toHaveProperty('_id');
      expect(res.body.todo.title).toBe(requestBody.title);
      expect(res.body.todo.description).toBe(requestBody.description);
      expect(res.body.todo).not.toHaveProperty('extraField');
    });
  });

  describe('GET /todos', () => {
    it('should fetch all todos', async () => {
      const res = await request(server).get('/todo');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should fetch only todos with a specific status', async () => {
      const status = TodoStatus.DRAFT;
      const res = await request(server).get(`/todo?status=${status}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      res.body.forEach((todo: ITodo) => {
        expect(todo.status).toEqual(status);
      });
    });

    it('should fetch todos with pagination', async () => {
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
    it.skip('should fetch a todo by ID', async () => {
      const res = await request(server).get(`/todo/${todoId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('_id', todoId);
      expect(res.body.title).toBe('Test Todo');
    });

    it('should return 404 for a non-existent todo', async () => {
      const res = await request(server).get(
        `/todo/${new mongoose.Types.ObjectId()}`
      );

      expect(res.statusCode).toEqual(status.NOT_FOUND);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Todo not found.');
    });

    it('should return 400 for an invalid ID format', async () => {
      const res = await request(server).get('/todo/invalid-id-format');

      expect(res.statusCode).toEqual(status.BAD_REQUEST);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Invalid ID format.');
    });

    it.skip('should return 200 and a todo with all properties', async () => {
      const res = await request(server).get(`/todo/${todoId}`);

      expect(res.statusCode).toEqual(status.OK);
      // expect(res.body).toHaveProperty('_id', todoId);
      expect(res.body).toHaveProperty('title');
      expect(res.body).toHaveProperty('description');
      expect(res.body).toHaveProperty('status');
      expect(res.body).toHaveProperty('created_by');
    });
  });

  describe.skip('PUT /todos/:id', () => {
    it('should update a todo by ID', async () => {
      const res = await request(server).put(`/todos/${todoId}`).send({
        title: 'Updated Test Todo',
        description: 'This is an updated test todo',
      });

      expect(res.statusCode).toEqual(status.OK);
      expect(res.body).toHaveProperty('_id', todoId);
      expect(res.body.title).toBe('Updated Test Todo');
    });
  });

  describe.skip('DELETE /todos/:id', () => {
    it('should delete a todo by ID', async () => {
      const res = await request(server).delete(`/todos/${todoId}`);
      expect(res.statusCode).toEqual(status.OK);
      expect(res.body).toHaveProperty('_id', todoId);
    });
  });
});
