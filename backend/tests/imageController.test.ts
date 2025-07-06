import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import nock from 'nock';
import imageRoutes from '../routes/imageRoutes';

const app = express();
app.use(bodyParser.json());
app.use('/api/images', imageRoutes);

// Mock Unsplash API
beforeAll(() => {
  nock('https://api.unsplash.com')
    .get('/photos')
    .query(true)
    .reply(200, [
      {
        id: 'img123',
        alt_description: 'Mocked Image',
        urls: {
          thumb: 'https://mock/thumb.jpg',
          full: 'https://mock/full.jpg',
        },
        likes: 10,
        user: { name: 'Mock User' },
      },
    ]);

  nock('https://api.unsplash.com')
    .get('/search/photos')
    .query(true)
    .reply(200, {
      results: [
        {
          id: 'img456',
          alt_description: 'Searched Image',
          urls: {
            thumb: 'https://mock/thumb.jpg',
            full: 'https://mock/full.jpg',
          },
          likes: 5,
          user: { name: 'Search User' },
        },
      ],
      total: 1,
      total_pages: 1,
    });
});

describe('Image API', () => {
  it('should fetch images without query', async () => {
    const res = await request(app).get('/api/images');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.images)).toBe(true);
    expect(res.body.images[0].alt_description).toBe('Mocked Image');
  });

  it('should fetch images with a search query', async () => {
    const res = await request(app).get('/api/images?q=dog');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.images)).toBe(true);
    expect(res.body.images[0].alt_description).toBe('Searched Image');
  });
});
