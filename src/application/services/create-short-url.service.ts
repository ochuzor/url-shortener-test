import { ShortenedUrl } from '../../domain/entities/shortened-url.entity.js';
import { DuplicateCodeError } from '../../domain/errors/domain-errors.js';
import { IUrlRepository } from '../../domain/repositories/url-repository.interface.js';
import { CreateShortUrlRequestDto, ShortUrlResponseDto } from '../dtos/url.dto.js';
import { ICodeGenerator } from '../ports/code-generator.interface.js';

export class CreateShortUrlService {
  private readonly maxCollisionRetries = 5;

  constructor(
    private readonly urlRepository: IUrlRepository,
    private readonly codeGenerator: ICodeGenerator,
    private readonly baseUrl: string
  ) {}

  async execute(dto: CreateShortUrlRequestDto): Promise<ShortUrlResponseDto> {
    const validatedUrl = ShortenedUrl.validateUrl(dto.url);
    const shortCode = await this.resolveOrGenerateCode(dto.customCode);
    const id = this.codeGenerator.generateId();

    const shortenedUrl = ShortenedUrl.create({
      id,
      originalUrl: validatedUrl,
      shortCode
    });

    await this.urlRepository.save(shortenedUrl);

    return this.mapToResponseDto(shortenedUrl);
  }

  private async resolveOrGenerateCode(customCode?: string): Promise<string> {
    if (customCode) {
      const validatedCustomCode = ShortenedUrl.validateShortCode(customCode);
      const exists = await this.urlRepository.existsByCode(validatedCustomCode);
      if (exists) {
        throw new DuplicateCodeError(validatedCustomCode);
      }
      return validatedCustomCode;
    }

    for (let attempt = 0; attempt < this.maxCollisionRetries; attempt++) {
      const generatedCode = this.codeGenerator.generateCode();
      const exists = await this.urlRepository.existsByCode(generatedCode);
      if (!exists) {
        return generatedCode;
      }
    }

    throw new Error('Failed to generate unique short code. Please try again.');
  }

  private mapToResponseDto(entity: ShortenedUrl): ShortUrlResponseDto {
    const formattedBaseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    return {
      id: entity.id,
      originalUrl: entity.originalUrl,
      shortCode: entity.shortCode,
      shortUrl: `${formattedBaseUrl}/${entity.shortCode}`,
      clicks: entity.clicks,
      createdAt: entity.createdAt.toISOString(),
      lastAccessedAt: entity.lastAccessedAt ? entity.lastAccessedAt.toISOString() : null
    };
  }
}
