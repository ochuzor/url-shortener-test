import { NextFunction, Request, Response } from 'express';
import { DomainError } from '../../../domain/errors/domain-errors.js';
import { logger } from '../../../infrastructure/logging/logger.js';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof DomainError) {
    res.status(err.statusCode).json({
      error: err.name,
      message: err.message
    });
    return;
  }

  logger.error('Unhandled Server Error', {
    errorName: err.name,
    errorMessage: err.message,
    stack: err.stack
  });

  res.status(500).json({
    error: 'InternalServerError',
    message: 'An unexpected error occurred on the server.'
  });
};
