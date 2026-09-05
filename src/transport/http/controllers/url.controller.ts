import { NextFunction, Request, Response } from 'express';
import { CreateShortUrlService } from '../../../application/services/create-short-url.service.js';
import { GetUrlStatsService } from '../../../application/services/get-url-stats.service.js';
import { ResolveShortUrlService } from '../../../application/services/resolve-short-url.service.js';

export class UrlController {
  constructor(
    private readonly createShortUrlService: CreateShortUrlService,
    private readonly resolveShortUrlService: ResolveShortUrlService,
    private readonly getUrlStatsService: GetUrlStatsService
  ) {}

  createShortUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { url, customCode } = req.body;
      const result = await this.createShortUrlService.execute({ url, customCode });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  resolveShortUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { shortCode } = req.params;
      const originalUrl = await this.resolveShortUrlService.execute(shortCode as string);
      res.redirect(302, originalUrl);
    } catch (error) {
      next(error);
    }
  };

  getUrlStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { shortCode } = req.params;
      const stats = await this.getUrlStatsService.execute(shortCode as string);
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  };
}
