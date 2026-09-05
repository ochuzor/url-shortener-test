import { describe, expect, it, vi } from 'vitest';
import { GetUrlStatsService } from '../../../src/application/services/get-url-stats.service.js';
import { ShortenedUrl } from '../../../src/domain/entities/shortened-url.entity.js';
import { UrlNotFoundError } from '../../../src/domain/errors/domain-errors.js';
import { IUrlRepository } from '../../../src/domain/repositories/url-repository.interface.js';

describe('GetUrlStatsService', () => {
  const baseUrl = 'https://short.est';

  it('should return URL stats if short code exists', async () => {
    const urlEntity = ShortenedUrl.create({
      id: 'id-1',
      originalUrl: 'https://example.com/stats',
      shortCode: 'statsCode'
    });
    urlEntity.recordClick();

    const mockRepository: IUrlRepository = {
      save: vi.fn(async (u) => u),
      findByCode: vi.fn(async () => urlEntity),
      findById: vi.fn(async () => urlEntity),
      existsByCode: vi.fn(async () => true),
      incrementClick: vi.fn(async () => urlEntity)
    };

    const service = new GetUrlStatsService(mockRepository, baseUrl);
    const stats = await service.execute('statsCode');

    expect(stats.shortCode).toBe('statsCode');
    expect(stats.originalUrl).toBe('https://example.com/stats');
    expect(stats.shortUrl).toBe('https://short.est/statsCode');
    expect(stats.clicks).toBe(1);
    expect(stats.createdAt).toBeDefined();
    expect(stats.lastAccessedAt).toBeDefined();
  });

  it('should throw UrlNotFoundError if short code does not exist', async () => {
    const mockRepository: IUrlRepository = {
      save: vi.fn(async (u) => u),
      findByCode: vi.fn(async () => null),
      findById: vi.fn(async () => null),
      existsByCode: vi.fn(async () => false),
      incrementClick: vi.fn(async () => null)
    };

    const service = new GetUrlStatsService(mockRepository, baseUrl);

    await expect(service.execute('missing')).rejects.toThrow(UrlNotFoundError);
  });
});
