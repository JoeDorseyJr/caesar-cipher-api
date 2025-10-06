import { Context, Next } from 'hono';
import { logger } from '../utils/logger';

export async function loggingMiddleware(c: Context, next: Next) {
  const start = Date.now();
  const method = c.req.method;
  const path = c.req.path;

  await next();

  const duration = Date.now() - start;
  const status = c.res.status;

  logger.info('Request completed', {
    method,
    route: path,
    status,
    duration,
  });
}
