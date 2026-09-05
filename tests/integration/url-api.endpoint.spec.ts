import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryUrlRepository } from '../../src/infrastructure/repositories/in-memory-url.repository.js';
import { createApp } from '../../src/transport/http/app.js';

describe('URL Shortener API Integration Tests', () => {
  let repository: InMemoryUrlRepository;
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    repository = new InMemoryUrlRepository();
    app = createApp({
      baseUrl: 'http://localhost:3000',
      urlRepository: repository
    });
  });

  describe('GET /health', () => {
    it('should return health status ok', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/v1/urls', () => {
    it('should create a short URL with auto-generated code', async () => {
      const response = await request(app)
        .post('/api/v1/urls')
        .send({ url: 'https://example.com/very/long/url' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('shortCode');
      expect(response.body.shortCode.length).toBe(7);
      expect(response.body.originalUrl).toBe('https://example.com/very/long/url');
      expect(response.body.shortUrl).toBe(`http://localhost:3000/${response.body.shortCode}`);
      expect(response.body.clicks).toBe(0);
    });

    it('should create a short URL with a valid custom alias', async () => {
      const response = await request(app)
        .post('/api/v1/urls')
        .send({
          url: 'https://example.com/custom',
          customCode: 'my-custom-link'
        });

      expect(response.status).toBe(201);
      expect(response.body.shortCode).toBe('my-custom-link');
      expect(response.body.shortUrl).toBe('http://localhost:3000/my-custom-link');
    });

    it('should return 409 Conflict if custom alias is already taken', async () => {
      await request(app).post('/api/v1/urls').send({
        url: 'https://example.com/first',
        customCode: 'taken-alias'
      });

      const response = await request(app).post('/api/v1/urls').send({
        url: 'https://example.com/second',
        customCode: 'taken-alias'
      });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error', 'DuplicateCodeError');
    });

    it('should return 400 Bad Request if URL is invalid or missing', async () => {
      const res1 = await request(app).post('/api/v1/urls').send({ url: 'not-a-url' });
      expect(res1.status).toBe(400);

      const res2 = await request(app).post('/api/v1/urls').send({});
      expect(res2.status).toBe(400);
    });
  });

  describe('GET /:shortCode (Redirection)', () => {
    it('should redirect to original URL with 302 and increment clicks', async () => {
      const createRes = await request(app).post('/api/v1/urls').send({
        url: 'https://example.com/target-redirect',
        customCode: 'redir1'
      });

      const shortCode = createRes.body.shortCode;

      const redirectRes = await request(app).get(`/${shortCode}`).redirects(0);

      expect(redirectRes.status).toBe(302);
      expect(redirectRes.header['location']).toBe('https://example.com/target-redirect');

      // Check stats to verify click was incremented
      const statsRes = await request(app).get(`/api/v1/urls/${shortCode}`);
      expect(statsRes.status).toBe(200);
      expect(statsRes.body.clicks).toBe(1);
      expect(statsRes.body.lastAccessedAt).not.toBeNull();
    });

    it('should return 404 Not Found if short code does not exist', async () => {
      const response = await request(app).get('/nonexistent-code').redirects(0);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'UrlNotFoundError');
    });
  });

  describe('GET /api/v1/urls/:shortCode (Analytics)', () => {
    it('should return URL stats successfully', async () => {
      const createRes = await request(app).post('/api/v1/urls').send({
        url: 'https://example.com/stats-test',
        customCode: 'stat123'
      });

      const response = await request(app).get('/api/v1/urls/stat123');
      expect(response.status).toBe(200);
      expect(response.body.shortCode).toBe('stat123');
      expect(response.body.originalUrl).toBe('https://example.com/stats-test');
      expect(response.body.clicks).toBe(0);
    });

    it('should return 404 Not Found when stats requested for missing code', async () => {
      const response = await request(app).get('/api/v1/urls/doesnotexist');
      expect(response.status).toBe(404);
    });
  });
});
