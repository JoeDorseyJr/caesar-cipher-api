/**
 * Structured logging utility
 * Provides consistent JSON-formatted logs for observability
 */

export interface LogContext {
  route?: string;
  method?: string;
  status?: number;
  duration?: number;
  error?: string;
  [key: string]: unknown;
}

export const logger = {
  info(message: string, context?: LogContext) {
    console.log(JSON.stringify({
      level: 'info',
      timestamp: new Date().toISOString(),
      message,
      ...context,
    }));
  },

  error(message: string, context?: LogContext) {
    console.error(JSON.stringify({
      level: 'error',
      timestamp: new Date().toISOString(),
      message,
      ...context,
    }));
  },

  warn(message: string, context?: LogContext) {
    console.warn(JSON.stringify({
      level: 'warn',
      timestamp: new Date().toISOString(),
      message,
      ...context,
    }));
  },

  debug(message: string, context?: LogContext) {
    console.debug(JSON.stringify({
      level: 'debug',
      timestamp: new Date().toISOString(),
      message,
      ...context,
    }));
  },
};
