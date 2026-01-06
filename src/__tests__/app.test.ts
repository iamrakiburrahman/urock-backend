import request from 'supertest';
import app from '../app';

describe('GET /api/v1', () => {
     it('should return 200 OK with a welcome message', async () => {
          const response = await request(app).get('/api/v1');
          expect(response.statusCode).toBe(200);
          expect(response.text).toContain('Welcome to  my backend');
     });
});

describe('GET /a-non-existent-route', () => {
     it('should return 404 Not Found', async () => {
          const response = await request(app).get('/this-route-does-not-exist');
          expect(response.statusCode).toBe(404);
     });
});
