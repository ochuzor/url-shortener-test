import { Router } from 'express';
import { HealthController } from '../controllers/health.controller.js';
import { UrlController } from '../controllers/url.controller.js';
import { validateRequest } from '../middleware/validate-request.middleware.js';
import { shortCodeParamSchema } from '../schemas/url.schema.js';

export const createRootRouter = (
  healthController: HealthController,
  urlController: UrlController
): Router => {
  const router = Router();

  router.get('/health', healthController.checkHealth);
  router.get('/:shortCode', validateRequest(shortCodeParamSchema), urlController.resolveShortUrl);

  return router;
};
