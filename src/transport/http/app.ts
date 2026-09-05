import express, { Express } from 'express';
import { CreateShortUrlService } from '../../application/services/create-short-url.service.js';
import { GetUrlStatsService } from '../../application/services/get-url-stats.service.js';
import { ResolveShortUrlService } from '../../application/services/resolve-short-url.service.js';
import { NanoidCodeGenerator } from '../../infrastructure/generator/nanoid-code-generator.js';
import { InMemoryUrlRepository } from '../../infrastructure/repositories/in-memory-url.repository.js';
import { HealthController } from './controllers/health.controller.js';
import { UrlController } from './controllers/url.controller.js';
import { errorHandler } from './middleware/error-handler.middleware.js';
import { requestLogger } from './middleware/request-logger.middleware.js';
import { createRootRouter } from './routes/root.routes.js';
import { createUrlRouter } from './routes/url.routes.js';

export interface AppDependencies {
  baseUrl?: string;
  urlRepository?: InMemoryUrlRepository;
}

export const createApp = (deps: AppDependencies = {}): Express => {
  const app = express();

  const baseUrl = deps.baseUrl || process.env.BASE_URL || 'http://localhost:3000';
  const repository = deps.urlRepository || new InMemoryUrlRepository();
  const codeGenerator = new NanoidCodeGenerator();

  const createShortUrlService = new CreateShortUrlService(repository, codeGenerator, baseUrl);
  const resolveShortUrlService = new ResolveShortUrlService(repository);
  const getUrlStatsService = new GetUrlStatsService(repository, baseUrl);

  const healthController = new HealthController();
  const urlController = new UrlController(
    createShortUrlService,
    resolveShortUrlService,
    getUrlStatsService
  );

  app.use(express.json());
  app.use(requestLogger);

  app.use('/api/v1/urls', createUrlRouter(urlController));
  app.use('/', createRootRouter(healthController, urlController));

  app.use(errorHandler);

  return app;
};
