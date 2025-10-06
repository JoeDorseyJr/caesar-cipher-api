import { Hono } from 'hono';
import { loggingMiddleware } from './middleware/logging';
import { authMiddleware } from './middleware/auth';
import health from './routes/health';
import encrypt from './routes/encrypt';
import decrypt from './routes/decrypt';
import encode from './routes/encode';
import rot13 from './routes/rot13';
import bruteforce from './routes/bruteforce';
import autoDecrypt from './routes/autoDecrypt';
import info from './routes/info';

export const app = new Hono();

// Apply logging middleware to all routes
app.use('*', loggingMiddleware);

// Public routes (no auth required)
app.route('/health', health);
app.route('/info', info);

// Protected routes (auth required)
app.use('/encrypt', authMiddleware);
app.use('/decrypt', authMiddleware);
app.use('/encode', authMiddleware);
app.use('/rot13', authMiddleware);
app.use('/bruteforce', authMiddleware);
app.use('/auto-decrypt', authMiddleware);

app.route('/encrypt', encrypt);
app.route('/decrypt', decrypt);
app.route('/encode', encode);
app.route('/rot13', rot13);
app.route('/bruteforce', bruteforce);
app.route('/auto-decrypt', autoDecrypt);

// Root route
app.get('/', (c) => {
  return c.json({ message: 'Caesar Cipher API' });
});
