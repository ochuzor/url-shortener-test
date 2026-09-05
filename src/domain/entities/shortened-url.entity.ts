import { InvalidCustomCodeError, InvalidUrlError } from '../errors/domain-errors.js';

export interface ShortenedUrlProps {
  id: string;
  originalUrl: string;
  shortCode: string;
  clicks?: number;
  createdAt?: Date;
  lastAccessedAt?: Date | null;
}

const SHORT_CODE_REGEX = /^[a-zA-Z0-9_-]{3,30}$/;

export class ShortenedUrl {
  readonly id: string;
  readonly originalUrl: string;
  readonly shortCode: string;
  private _clicks: number;
  readonly createdAt: Date;
  private _lastAccessedAt: Date | null;

  private constructor(props: {
    id: string;
    originalUrl: string;
    shortCode: string;
    clicks: number;
    createdAt: Date;
    lastAccessedAt: Date | null;
  }) {
    this.id = props.id;
    this.originalUrl = props.originalUrl;
    this.shortCode = props.shortCode;
    this._clicks = props.clicks;
    this.createdAt = props.createdAt;
    this._lastAccessedAt = props.lastAccessedAt;
  }

  get clicks(): number {
    return this._clicks;
  }

  get lastAccessedAt(): Date | null {
    return this._lastAccessedAt;
  }

  static validateUrl(url: string): string {
    if (!url || typeof url !== 'string') {
      throw new InvalidUrlError('URL must be a non-empty string.');
    }

    const trimmedUrl = url.trim();
    try {
      const parsed = new URL(trimmedUrl);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new InvalidUrlError('Only http and https protocols are supported.');
      }
      return parsed.toString();
    } catch (error) {
      if (error instanceof InvalidUrlError) {
        throw error;
      }
      throw new InvalidUrlError(`Invalid URL format: '${url}'.`);
    }
  }

  static validateShortCode(code: string): string {
    if (!code || typeof code !== 'string') {
      throw new InvalidCustomCodeError('Short code must be a non-empty string.');
    }

    const trimmedCode = code.trim();
    if (!SHORT_CODE_REGEX.test(trimmedCode)) {
      throw new InvalidCustomCodeError(
        `Short code '${trimmedCode}' is invalid. It must be 3-30 alphanumeric, hyphen, or underscore characters.`
      );
    }

    return trimmedCode;
  }

  static create(props: ShortenedUrlProps): ShortenedUrl {
    const validatedUrl = ShortenedUrl.validateUrl(props.originalUrl);
    const validatedCode = ShortenedUrl.validateShortCode(props.shortCode);

    return new ShortenedUrl({
      id: props.id,
      originalUrl: validatedUrl,
      shortCode: validatedCode,
      clicks: props.clicks ?? 0,
      createdAt: props.createdAt ?? new Date(),
      lastAccessedAt: props.lastAccessedAt ?? null
    });
  }

  recordClick(accessDate: Date = new Date()): void {
    this._clicks += 1;
    this._lastAccessedAt = accessDate;
  }
}
