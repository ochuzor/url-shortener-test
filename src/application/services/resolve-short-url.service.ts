import { UrlNotFoundError } from '../../domain/errors/domain-errors.js';
import { IUrlRepository } from '../../domain/repositories/url-repository.interface.js';

export class ResolveShortUrlService {
  constructor(private readonly urlRepository: IUrlRepository) {}

  async execute(shortCode: string): Promise<string> {
    const updatedUrl = await this.urlRepository.incrementClick(shortCode);
    if (!updatedUrl) {
      throw new UrlNotFoundError(shortCode);
    }
    return updatedUrl.originalUrl;
  }
}
