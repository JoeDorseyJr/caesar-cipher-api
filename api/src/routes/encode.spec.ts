import { describe, it, expect } from 'bun:test';
import { app } from '../app';

describe('POST /encode', () => {
  describe('default shift behavior (CC-ENCDEF-001)', () => {
    it('uses shift 3 when shift is not provided', async () => {
      const req = new Request('http://localhost/encode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Hello' }),
      });

      const res = await app.fetch(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual({ encoded: 'Khoor', shift: 3 });
    });

    it('applies default shift of 3 to complex text', async () => {
      const req = new Request('http://localhost/encode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'The Quick Brown Fox!' }),
      });

      const res = await app.fetch(req);
      const data = await res.json() as { encoded: string; shift: number };

      expect(res.status).toBe(200);
      expect(data.shift).toBe(3);
      expect(data.encoded).toBe('Wkh Txlfn Eurzq Ira!');
    });
  });

  describe('custom shift behavior (CC-ENCDEF-002)', () => {
    it('allows custom shift when provided', async () => {
      const req = new Request('http://localhost/encode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Hello', shift: 5 }),
      });

      const res = await app.fetch(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual({ encoded: 'Mjqqt', shift: 5 });
    });

    it('accepts shift of 0', async () => {
      const req = new Request('http://localhost/encode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Test', shift: 0 }),
      });

      const res = await app.fetch(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual({ encoded: 'Test', shift: 0 });
    });

    it('accepts shift of 25', async () => {
      const req = new Request('http://localhost/encode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'ABC', shift: 25 }),
      });

      const res = await app.fetch(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual({ encoded: 'ZAB', shift: 25 });
    });
  });

  describe('validation errors', () => {
    it('returns 400 for missing text', async () => {
      const req = new Request('http://localhost/encode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const res = await app.fetch(req);
      expect(res.status).toBe(400);
    });

    it('returns 400 for shift below 0', async () => {
      const req = new Request('http://localhost/encode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Hello', shift: -1 }),
      });

      const res = await app.fetch(req);
      expect(res.status).toBe(400);
    });

    it('returns 400 for shift above 25', async () => {
      const req = new Request('http://localhost/encode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Hello', shift: 26 }),
      });

      const res = await app.fetch(req);
      expect(res.status).toBe(400);
    });
  });

  describe('payload structure', () => {
    it('returns object with encoded and shift keys', async () => {
      const req = new Request('http://localhost/encode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Test' }),
      });

      const res = await app.fetch(req);
      const data = await res.json() as Record<string, unknown>;

      expect(res.status).toBe(200);
      expect(Object.keys(data).sort()).toEqual(['encoded', 'shift']);
      expect(typeof data.encoded).toBe('string');
      expect(typeof data.shift).toBe('number');
    });
  });
});
