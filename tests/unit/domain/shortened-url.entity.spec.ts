import { describe, expect, it } from 'vitest';
import { ShortenedUrl } from '../../../src/domain/entities/shortened-url.entity.js';
import { InvalidCustomCodeError, InvalidUrlError } from '../../../src/domain/errors/domain-errors.js';

describe('ShortenedUrl Entity', () => {
  it('should create a valid ShortenedUrl instance', () => {
    const url = ShortenedUrl.create({
      id: 'test-id',
      originalUrl: 'https://example.com/some/path',
      shortCode: 'validCode123'
    });

    expect(url.id).toBe('test-id');
    expect(url.originalUrl).toBe('https://example.com/some/path');
    expect(url.shortCode).toBe('validCode123');
    expect(url.clicks).toBe(0);
    expect(url.createdAt).toBeInstanceOf(Date);
    expect(url.lastAccessedAt).toBeNull();
  });

  it('should increment clicks and update lastAccessedAt', () => {
    const url = ShortenedUrl.create({
      id: 'test-id',
      originalUrl: 'https://example.com',
      shortCode: 'abc1234'
    });

    const accessDate = new Date('2026-05-09T10:00:00.000Z');
    url.recordClick(accessDate);

    expect(url.clicks).toBe(1);
    expect(url.lastAccessedAt).toEqual(accessDate);

    url.recordClick();
    expect(url.clicks).toBe(2);
  });

  it('should throw InvalidUrlError for non-HTTP/HTTPS URLs', () => {
    expect(() => {
      ShortenedUrl.create({
        id: 'test-id',
        originalUrl: 'ftp://example.com',
        shortCode: 'abc1234'
      });
    }).toThrow(InvalidUrlError);

    expect(() => {
      ShortenedUrl.create({
        id: 'test-id',
        originalUrl: 'javascript:alert(1)',
        shortCode: 'abc1234'
      });
    }).toThrow(InvalidUrlError);
  });

  it('should throw InvalidUrlError for malformed URLs', () => {
    expect(() => {
      ShortenedUrl.create({
        id: 'test-id',
        originalUrl: 'not-a-valid-url',
        shortCode: 'abc1234'
      });
    }).toThrow(InvalidUrlError);
  });

  it('should throw InvalidCustomCodeError for invalid short codes', () => {
    // Too short (< 3 chars)
    expect(() => {
      ShortenedUrl.create({
        id: 'test-id',
        originalUrl: 'https://example.com',
        shortCode: 'ab'
      });
    }).toThrow(InvalidCustomCodeError);

    // Invalid characters (spaces, symbols)
    expect(() => {
      ShortenedUrl.create({
        id: 'test-id',
        originalUrl: 'https://example.com',
        shortCode: 'code with spaces'
      });
    }).toThrow(InvalidCustomCodeError);

    expect(() => {
      ShortenedUrl.create({
        id: 'test-id',
        originalUrl: 'https://example.com',
        shortCode: 'code!@#$'
      });
    }).toThrow(InvalidCustomCodeError);
  });
});
