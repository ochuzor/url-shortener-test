export interface ILogger {
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
  debug(message: string, context?: Record<string, unknown>): void;
}

export class ConsoleLogger implements ILogger {
  private formatLog(level: string, message: string, context?: Record<string, unknown>): string {
    const timestamp = new Date().toISOString();
    const contextString = context && Object.keys(context).length > 0 ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}${contextString}`;
  }

  info(message: string, context?: Record<string, unknown>): void {
    console.log(this.formatLog('info', message, context));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(this.formatLog('warn', message, context));
  }

  error(message: string, context?: Record<string, unknown>): void {
    console.error(this.formatLog('error', message, context));
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'development' || process.env.LOG_LEVEL === 'debug') {
      console.debug(this.formatLog('debug', message, context));
    }
  }
}

export const logger = new ConsoleLogger();
