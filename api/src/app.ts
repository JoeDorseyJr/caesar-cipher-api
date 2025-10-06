import { Hono } from 'hono';
import { loggingMiddleware } from './middleware/logging';
import health from './routes/health';

export const app = new Hono();

// Apply logging middleware to all routes
app.use('*', loggingMiddleware);

// Mount routes
app.route('/health', health);

// Root route
app.get('/', (c) => {
  return c.json({ message: 'Caesar Cipher API' });
});
