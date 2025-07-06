import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import commentRoutes from '../routes/commentRoutes';

const app = express();
app.use(bodyParser.json());
app.use('/api/comments', commentRoutes);

describe('Comment API', () => {
  const imageId = 'test-image-id';

  it('should reject empty comment', async () => {
    const res = await request(app)
      .post(`/api/comments/${imageId}`)
      .send({ content: '' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/comment too short/i);
  });

//   it('should reject missing imageId', async () => {
//     const res = await request(app).post('/api/comments/').send({ content: 'Nice!' });
//     expect(res.statusCode).toBe(404); // No imageId param at all
//   });

  it('should fetch comments for a valid image', async () => {
    const res = await request(app).get(`/api/comments/${imageId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
