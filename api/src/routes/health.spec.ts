import { describe, test, expect } from 'bun:test';
import { app } from '../app';

describe('Health endpoint', () => {
  test('GET /health returns ok status', async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);
    
    const body = await res.json();
    expect(body).toEqual({ status: 'ok' });
  });

  test('GET /health completes quickly', async () => {
    const start = Date.now();
    const res = await app.request('/health');
    const duration = Date.now() - start;
    
    expect(res.status).toBe(200);
    expect(duration).toBeLessThan(50); // NFR: <50ms
  });
});
