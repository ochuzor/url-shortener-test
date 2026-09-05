export interface CreateShortUrlRequestDto {
  url: string;
  customCode?: string;
}

export interface ShortUrlResponseDto {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
  lastAccessedAt: string | null;
}

export interface UrlStatsResponseDto {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
  lastAccessedAt: string | null;
}
