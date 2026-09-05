import { Router } from 'express';
import { UrlController } from '../controllers/url.controller.js';
import { validateRequest } from '../middleware/validate-request.middleware.js';
import { createShortUrlSchema, shortCodeParamSchema } from '../schemas/url.schema.js';

export const createUrlRouter = (urlController: UrlController): Router => {
  const router = Router();

  router.post('/', validateRequest(createShortUrlSchema), urlController.createShortUrl);
  router.get('/:shortCode', validateRequest(shortCodeParamSchema), urlController.getUrlStats);

  return router;
};
