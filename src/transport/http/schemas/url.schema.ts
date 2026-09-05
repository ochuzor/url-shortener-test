import { z } from 'zod';

export const createShortUrlSchema = z.object({
  body: z.object({
    url: z
      .string({ message: 'URL is required' })
      .trim()
      .min(1, 'URL cannot be empty')
      .url('Invalid URL format'),
    customCode: z
      .string()
      .trim()
      .min(3, 'Custom short code must be at least 3 characters long')
      .max(30, 'Custom short code must not exceed 30 characters')
      .regex(/^[a-zA-Z0-9_-]+$/, 'Custom short code can only contain alphanumeric characters, hyphens, and underscores')
      .optional()
  })
});

export const shortCodeParamSchema = z.object({
  params: z.object({
    shortCode: z
      .string()
      .trim()
      .min(1, 'Short code parameter is required')
  })
});

export type CreateShortUrlInput = z.infer<typeof createShortUrlSchema>;
export type ShortCodeParamInput = z.infer<typeof shortCodeParamSchema>;
