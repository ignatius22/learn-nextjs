/**
 * Structured logging utility for production environments
 * Provides consistent logging format across the application
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
  userId?: string;
  requestId?: string;
  path?: string;
  method?: string;
  statusCode?: number;
  duration?: number;
  error?: Error | string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isTest = process.env.NODE_ENV === 'test';

  private formatLog(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...context,
      environment: process.env.NODE_ENV,
    };

    // In development, use console methods for better DX
    if (this.isDevelopment) {
      const emoji = {
        debug: '🔍',
        info: 'ℹ️',
        warn: '⚠️',
        error: '❌',
      };

      const prefix = `${emoji[level]} [${level.toUpperCase()}]`;

      switch (level) {
        case 'debug':
          console.debug(prefix, message, context || '');
          break;
        case 'info':
          console.info(prefix, message, context || '');
          break;
        case 'warn':
          console.warn(prefix, message, context || '');
          break;
        case 'error':
          console.error(prefix, message, context || '');
          break;
      }
      return;
    }

    // In production, output structured JSON for log aggregation
    console.log(JSON.stringify(logEntry));
  }

  debug(message: string, context?: LogContext) {
    if (!this.isTest) {
      this.formatLog('debug', message, context);
    }
  }

  info(message: string, context?: LogContext) {
    if (!this.isTest) {
      this.formatLog('info', message, context);
    }
  }

  warn(message: string, context?: LogContext) {
    this.formatLog('warn', message, context);
  }

  error(message: string, context?: LogContext) {
    this.formatLog('error', message, context);
  }

  // Specialized logging methods
  http(method: string, path: string, statusCode: number, duration: number, context?: LogContext) {
    this.info('HTTP Request', {
      method,
      path,
      statusCode,
      duration,
      ...context,
    });
  }

  database(operation: string, table: string, duration?: number, context?: LogContext) {
    this.debug('Database Operation', {
      operation,
      table,
      duration,
      ...context,
    });
  }

  auth(event: string, userId?: string, context?: LogContext) {
    this.info('Authentication Event', {
      event,
      userId,
      ...context,
    });
  }

  security(event: string, severity: 'low' | 'medium' | 'high' | 'critical', context?: LogContext) {
    const method = severity === 'critical' || severity === 'high' ? 'error' : 'warn';
    this[method]('Security Event', {
      event,
      severity,
      ...context,
    });
  }
}

// Export singleton instance
export const logger = new Logger();

// Utility function to create child logger with default context
export function createLogger(defaultContext: LogContext) {
  return {
    debug: (message: string, context?: LogContext) =>
      logger.debug(message, { ...defaultContext, ...context }),
    info: (message: string, context?: LogContext) =>
      logger.info(message, { ...defaultContext, ...context }),
    warn: (message: string, context?: LogContext) =>
      logger.warn(message, { ...defaultContext, ...context }),
    error: (message: string, context?: LogContext) =>
      logger.error(message, { ...defaultContext, ...context }),
  };
}
