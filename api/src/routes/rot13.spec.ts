import { describe, it, expect } from 'bun:test';
import { app } from '../app';

describe('POST /rot13', () => {
  describe('ROT13 encoding (CC-ROT13-001)', () => {
    it('applies shift of 13 to text', async () => {
      const req = new Request('http://localhost/rot13', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Hello' }),
      });

      const res = await app.fetch(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual({ encoded: 'Uryyb', shift: 13 });
    });

    it('is symmetric (applying twice returns original)', async () => {
      const original = 'The Quick Brown Fox!';
      
      // First application
      const req1 = new Request('http://localhost/rot13', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: original }),
      });
      const res1 = await app.fetch(req1);
      const data1 = await res1.json() as { encoded: string };

      // Second application
      const req2 = new Request('http://localhost/rot13', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: data1.encoded }),
      });
      const res2 = await app.fetch(req2);
      const data2 = await res2.json() as { encoded: string };

      expect(data2.encoded).toBe(original);
    });

    it('preserves case and punctuation', async () => {
      const req = new Request('http://localhost/rot13', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'ABC, xyz!' }),
      });

      const res = await app.fetch(req);
      const data = await res.json() as { encoded: string };

      expect(res.status).toBe(200);
      expect(data.encoded).toBe('NOP, klm!');
    });

    it('handles empty string', async () => {
      const req = new Request('http://localhost/rot13', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: '' }),
      });

      const res = await app.fetch(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual({ encoded: '', shift: 13 });
    });
  });

  describe('payload structure (CC-ROT13-002)', () => {
    it('returns object with encoded and shift keys', async () => {
      const req = new Request('http://localhost/rot13', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Test' }),
      });

      const res = await app.fetch(req);
      const data = await res.json() as Record<string, unknown>;

      expect(res.status).toBe(200);
      expect(Object.keys(data).sort()).toEqual(['encoded', 'shift']);
      expect(typeof data.encoded).toBe('string');
      expect(data.shift).toBe(13);
    });

    it('always returns shift value of 13', async () => {
      const req = new Request('http://localhost/rot13', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Any text here' }),
      });

      const res = await app.fetch(req);
      const data = await res.json() as { shift: number };

      expect(data.shift).toBe(13);
    });
  });

  describe('validation errors', () => {
    it('returns 400 for missing text', async () => {
      const req = new Request('http://localhost/rot13', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const res = await app.fetch(req);
      expect(res.status).toBe(400);
    });

    it('returns 400 for non-string text', async () => {
      const req = new Request('http://localhost/rot13', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 123 }),
      });

      const res = await app.fetch(req);
      expect(res.status).toBe(400);
    });
  });

  describe('no shift parameter accepted', () => {
    it('ignores shift parameter if provided', async () => {
      const req = new Request('http://localhost/rot13', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Hello', shift: 5 }),
      });

      const res = await app.fetch(req);
      const data = await res.json() as { shift: number; encoded: string };

      expect(res.status).toBe(200);
      expect(data.shift).toBe(13); // Should always be 13, not 5
      expect(data.encoded).toBe('Uryyb'); // ROT13 of Hello, not shift 5
    });
  });
});
