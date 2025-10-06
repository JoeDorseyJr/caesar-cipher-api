import { Hono } from 'hono';
import packageJson from '../../package.json';

const infoRoute = new Hono();

infoRoute.get('/', (c) => {
  return c.json({
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    endpoints: [
      { method: 'GET', path: '/health', description: 'Health check endpoint' },
      { method: 'GET', path: '/info', description: 'API metadata and available endpoints' },
      { method: 'POST', path: '/encrypt', description: 'Encrypt text with specified shift' },
      { method: 'POST', path: '/decrypt', description: 'Decrypt text with specified shift' },
      { method: 'POST', path: '/encode', description: 'Quick encrypt with default shift (3)' },
      { method: 'POST', path: '/rot13', description: 'Apply ROT13 encoding (shift 13)' },
      { method: 'POST', path: '/bruteforce', description: 'Show all possible shifts (0-25)' },
      { method: 'POST', path: '/auto-decrypt', description: 'Auto-detect most likely plaintext' },
    ],
  });
});

export default infoRoute;
