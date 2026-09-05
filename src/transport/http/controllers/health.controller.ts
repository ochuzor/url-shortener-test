import { Request, Response } from 'express';

export class HealthController {
  checkHealth = (_req: Request, res: Response): void => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString()
    });
  };
}
