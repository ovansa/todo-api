import request from 'supertest';
import status from 'http-status';
import { server } from '../../../index';
import mongoose from 'mongoose';

afterAll(async () => {
  await server.close();
  await mongoose.disconnect();
});

describe('Create Todo', () => {
  it('should create todo successfully with valid name', async () => {
    const body = {
      name: 'My random todo',
    };

    const res = await request(server)
      .post('/todo')
      .send(body)
      .set('Accept', 'application/json');

    expect(res.status).toBe(status.CREATED);
  });
});
