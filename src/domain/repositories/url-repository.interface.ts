import { ShortenedUrl } from '../entities/shortened-url.entity.js';

export interface IUrlRepository {
  save(url: ShortenedUrl): Promise<ShortenedUrl>;
  findByCode(code: string): Promise<ShortenedUrl | null>;
  findById(id: string): Promise<ShortenedUrl | null>;
  existsByCode(code: string): Promise<boolean>;
  incrementClick(code: string): Promise<ShortenedUrl | null>;
}
