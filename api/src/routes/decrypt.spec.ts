import { describe, it, expect } from 'bun:test';
import { app } from '../app';

describe('POST /decrypt', () => {
  describe('successful decryption', () => {
    it('decrypts text with valid shift', async () => {
      const req = new Request('http://localhost/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Khoor', shift: 3 }),
      });

      const res = await app.fetch(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual({ decrypted: 'Hello', shift: 3 });
    });

    it('handles shift of 0', async () => {
      const req = new Request('http://localhost/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Test', shift: 0 }),
      });

      const res = await app.fetch(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual({ decrypted: 'Test', shift: 0 });
    });

    it('handles shift of 25', async () => {
      const req = new Request('http://localhost/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'ZAB', shift: 25 }),
      });

      const res = await app.fetch(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual({ decrypted: 'ABC', shift: 25 });
    });

    it('preserves case and punctuation', async () => {
      const req = new Request('http://localhost/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Mjqqt, Btwqi!', shift: 5 }),
      });

      const res = await app.fetch(req);
      const data = await res.json() as { decrypted: string; shift: number };

      expect(res.status).toBe(200);
      expect(data.decrypted).toBe('Hello, World!');
    });

    it('round-trips with encryption', async () => {
      const original = 'The quick brown fox jumps over the lazy dog!';
      const shift = 13;

      // Encrypt
      const encryptReq = new Request('http://localhost/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: original, shift }),
      });
      const encryptRes = await app.fetch(encryptReq);
      const { encrypted } = await encryptRes.json() as { encrypted: string };

      // Decrypt
      const decryptReq = new Request('http://localhost/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: encrypted, shift }),
      });
      const decryptRes = await app.fetch(decryptReq);
      const { decrypted } = await decryptRes.json() as { decrypted: string };

      expect(decrypted).toBe(original);
    });
  });

  describe('validation errors', () => {
    it('returns 400 for missing text', async () => {
      const req = new Request('http://localhost/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shift: 3 }),
      });

      const res = await app.fetch(req);
      expect(res.status).toBe(400);
    });

    it('returns 400 for missing shift', async () => {
      const req = new Request('http://localhost/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Hello' }),
      });

      const res = await app.fetch(req);
      expect(res.status).toBe(400);
    });

    it('returns 400 for shift below 0 (CC-DEC-003)', async () => {
      const req = new Request('http://localhost/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Hello', shift: -1 }),
      });

      const res = await app.fetch(req);
      expect(res.status).toBe(400);
    });

    it('returns 400 for shift above 25 (CC-DEC-003)', async () => {
      const req = new Request('http://localhost/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Hello', shift: 26 }),
      });

      const res = await app.fetch(req);
      expect(res.status).toBe(400);
    });

    it('returns 400 for non-numeric shift', async () => {
      const req = new Request('http://localhost/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Hello', shift: 'thirteen' }),
      });

      const res = await app.fetch(req);
      expect(res.status).toBe(400);
    });

    it('returns 400 for non-string text', async () => {
      const req = new Request('http://localhost/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 123, shift: 3 }),
      });

      const res = await app.fetch(req);
      expect(res.status).toBe(400);
    });
  });
});
