import { describe, expect, it, vi } from 'vitest';
import { ResolveShortUrlService } from '../../../src/application/services/resolve-short-url.service.js';
import { ShortenedUrl } from '../../../src/domain/entities/shortened-url.entity.js';
import { UrlNotFoundError } from '../../../src/domain/errors/domain-errors.js';
import { IUrlRepository } from '../../../src/domain/repositories/url-repository.interface.js';

describe('ResolveShortUrlService', () => {
  it('should resolve short code to original URL and increment click', async () => {
    const urlEntity = ShortenedUrl.create({
      id: 'id-1',
      originalUrl: 'https://example.com/target',
      shortCode: 'code123'
    });

    const mockRepository: IUrlRepository = {
      save: vi.fn(async (u) => u),
      findByCode: vi.fn(async () => urlEntity),
      findById: vi.fn(async () => urlEntity),
      existsByCode: vi.fn(async () => true),
      incrementClick: vi.fn(async () => {
        urlEntity.recordClick();
        return urlEntity;
      })
    };

    const service = new ResolveShortUrlService(mockRepository);
    const resolvedUrl = await service.execute('code123');

    expect(resolvedUrl).toBe('https://example.com/target');
    expect(urlEntity.clicks).toBe(1);
    expect(mockRepository.incrementClick).toHaveBeenCalledWith('code123');
  });

  it('should throw UrlNotFoundError if short code does not exist', async () => {
    const mockRepository: IUrlRepository = {
      save: vi.fn(async (u) => u),
      findByCode: vi.fn(async () => null),
      findById: vi.fn(async () => null),
      existsByCode: vi.fn(async () => false),
      incrementClick: vi.fn(async () => null)
    };

    const service = new ResolveShortUrlService(mockRepository);

    await expect(service.execute('nonexistent')).rejects.toThrow(UrlNotFoundError);
  });
});
