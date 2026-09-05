import { describe, expect, it, vi } from 'vitest';
import { ICodeGenerator } from '../../../src/application/ports/code-generator.interface.js';
import { CreateShortUrlService } from '../../../src/application/services/create-short-url.service.js';
import { DuplicateCodeError } from '../../../src/domain/errors/domain-errors.js';
import { IUrlRepository } from '../../../src/domain/repositories/url-repository.interface.js';

describe('CreateShortUrlService', () => {
  const mockRepository: IUrlRepository = {
    save: vi.fn(async (url) => url),
    findByCode: vi.fn(async () => null),
    findById: vi.fn(async () => null),
    existsByCode: vi.fn(async () => false),
    incrementClick: vi.fn(async () => null)
  };

  const mockGenerator: ICodeGenerator = {
    generateCode: vi.fn(() => 'abc1234'),
    generateId: vi.fn(() => 'uuid-123')
  };

  const baseUrl = 'https://short.est';

  it('should successfully create a shortened URL with auto-generated code', async () => {
    vi.mocked(mockRepository.existsByCode).mockResolvedValueOnce(false);

    const service = new CreateShortUrlService(mockRepository, mockGenerator, baseUrl);
    const result = await service.execute({ url: 'https://example.com/long/path' });

    expect(result.originalUrl).toBe('https://example.com/long/path');
    expect(result.shortCode).toBe('abc1234');
    expect(result.shortUrl).toBe('https://short.est/abc1234');
    expect(result.clicks).toBe(0);
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should successfully create a shortened URL with valid custom code', async () => {
    vi.mocked(mockRepository.existsByCode).mockResolvedValueOnce(false);

    const service = new CreateShortUrlService(mockRepository, mockGenerator, baseUrl);
    const result = await service.execute({
      url: 'https://example.com',
      customCode: 'my-alias'
    });

    expect(result.shortCode).toBe('my-alias');
    expect(result.shortUrl).toBe('https://short.est/my-alias');
    expect(mockRepository.existsByCode).toHaveBeenCalledWith('my-alias');
  });

  it('should throw DuplicateCodeError if custom code already exists', async () => {
    vi.mocked(mockRepository.existsByCode).mockResolvedValueOnce(true);

    const service = new CreateShortUrlService(mockRepository, mockGenerator, baseUrl);

    await expect(
      service.execute({
        url: 'https://example.com',
        customCode: 'taken-code'
      })
    ).rejects.toThrow(DuplicateCodeError);
  });
});
