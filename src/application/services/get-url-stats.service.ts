import { UrlNotFoundError } from '../../domain/errors/domain-errors.js';
import { IUrlRepository } from '../../domain/repositories/url-repository.interface.js';
import { UrlStatsResponseDto } from '../dtos/url.dto.js';

export class GetUrlStatsService {
  constructor(
    private readonly urlRepository: IUrlRepository,
    private readonly baseUrl: string
  ) {}

  async execute(shortCode: string): Promise<UrlStatsResponseDto> {
    const urlEntity = await this.urlRepository.findByCode(shortCode);
    if (!urlEntity) {
      throw new UrlNotFoundError(shortCode);
    }

    const formattedBaseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;

    return {
      id: urlEntity.id,
      originalUrl: urlEntity.originalUrl,
      shortCode: urlEntity.shortCode,
      shortUrl: `${formattedBaseUrl}/${urlEntity.shortCode}`,
      clicks: urlEntity.clicks,
      createdAt: urlEntity.createdAt.toISOString(),
      lastAccessedAt: urlEntity.lastAccessedAt ? urlEntity.lastAccessedAt.toISOString() : null
    };
  }
}
