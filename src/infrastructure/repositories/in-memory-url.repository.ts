import { ShortenedUrl } from '../../domain/entities/shortened-url.entity.js';
import { IUrlRepository } from '../../domain/repositories/url-repository.interface.js';

export class InMemoryUrlRepository implements IUrlRepository {
  private readonly urlsById: Map<string, ShortenedUrl> = new Map();
  private readonly idByCode: Map<string, string> = new Map();

  async save(url: ShortenedUrl): Promise<ShortenedUrl> {
    this.urlsById.set(url.id, url);
    this.idByCode.set(url.shortCode, url.id);
    return url;
  }

  async findByCode(code: string): Promise<ShortenedUrl | null> {
    const id = this.idByCode.get(code);
    if (!id) {
      return null;
    }
    return this.urlsById.get(id) ?? null;
  }

  async findById(id: string): Promise<ShortenedUrl | null> {
    return this.urlsById.get(id) ?? null;
  }

  async existsByCode(code: string): Promise<boolean> {
    return this.idByCode.has(code);
  }

  async incrementClick(code: string): Promise<ShortenedUrl | null> {
    const url = await this.findByCode(code);
    if (!url) {
      return null;
    }
    url.recordClick();
    return url;
  }

  async clear(): Promise<void> {
    this.urlsById.clear();
    this.idByCode.clear();
  }
}
