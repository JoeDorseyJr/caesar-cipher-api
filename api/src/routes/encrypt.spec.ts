import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { app } from '../app';
import { setupTestAuth, cleanupTestAuth, getAuthHeader } from '../test-helpers/auth';

let authToken: string;

describe('POST /encrypt', () => {
  beforeAll(async () => {
    authToken = await setupTestAuth();
  });

  afterAll(async () => {
    await cleanupTestAuth();
  });

  describe('successful encryption', () => {
    it('encrypts text with valid shift', async () => {
      const req = new Request('http://localhost/encrypt', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeader(authToken),
        },
        body: JSON.stringify({ text: 'Hello', shift: 3 }),
      });

      const res = await app.fetch(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual({ encrypted: 'Khoor', shift: 3 });
    });

    it('handles shift of 0', async () => {
      const req = new Request('http://localhost/encrypt', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeader(authToken),
        },
        body: JSON.stringify({ text: 'Test', shift: 0 }),
      });

      const res = await app.fetch(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual({ encrypted: 'Test', shift: 0 });
    });

    it('handles shift of 25', async () => {
      const req = new Request('http://localhost/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader(authToken) },
        body: JSON.stringify({ text: 'ABC', shift: 25 }),
      });

      const res = await app.fetch(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual({ encrypted: 'ZAB', shift: 25 });
    });

    it('preserves case and punctuation', async () => {
      const req = new Request('http://localhost/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader(authToken) },
        body: JSON.stringify({ text: 'Hello, World!', shift: 5 }),
      });

      const res = await app.fetch(req);
      const data = await res.json() as { encrypted: string; shift: number };

      expect(res.status).toBe(200);
      expect(data.encrypted).toBe('Mjqqt, Btwqi!');
    });
  });

  describe('validation errors', () => {
    it('returns 400 for missing text', async () => {
      const req = new Request('http://localhost/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader(authToken) },
        body: JSON.stringify({ shift: 3 }),
      });

      const res = await app.fetch(req);
      expect(res.status).toBe(400);
    });

    it('returns 400 for missing shift', async () => {
      const req = new Request('http://localhost/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader(authToken) },
        body: JSON.stringify({ text: 'Hello' }),
      });

      const res = await app.fetch(req);
      expect(res.status).toBe(400);
    });

    it('returns 400 for shift below 0 (CC-ENC-002)', async () => {
      const req = new Request('http://localhost/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader(authToken) },
        body: JSON.stringify({ text: 'Hello', shift: -1 }),
      });

      const res = await app.fetch(req);
      expect(res.status).toBe(400);
    });

    it('returns 400 for shift above 25 (CC-ENC-002)', async () => {
      const req = new Request('http://localhost/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader(authToken) },
        body: JSON.stringify({ text: 'Hello', shift: 26 }),
      });

      const res = await app.fetch(req);
      expect(res.status).toBe(400);
    });

    it('returns 400 for non-numeric shift', async () => {
      const req = new Request('http://localhost/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader(authToken) },
        body: JSON.stringify({ text: 'Hello', shift: 'three' }),
      });

      const res = await app.fetch(req);
      expect(res.status).toBe(400);
    });

    it('returns 400 for non-string text', async () => {
      const req = new Request('http://localhost/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader(authToken) },
        body: JSON.stringify({ text: 123, shift: 3 }),
      });

      const res = await app.fetch(req);
      expect(res.status).toBe(400);
    });
  });
});
