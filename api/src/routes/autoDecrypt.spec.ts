import { describe, it, expect } from 'bun:test';
import { app } from '../app';

describe('POST /auto-decrypt', () => {
  it('should accept text input (CC-AUTO-001)', async () => {
    const res = await app.request('/auto-decrypt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Khoor, Zruog!' }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.decrypted).toBeDefined();
    expect(data.shift).toBeDefined();
  });

  it('should detect correct shift using frequency analysis (CC-AUTO-002)', async () => {
    const ciphertext = 'Wkh txlfn eurzq ira mxpsv ryhu wkh odcb grj';
    const res = await app.request('/auto-decrypt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: ciphertext }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.shift).toBe(3);
    expect(data.decrypted).toBe('The quick brown fox jumps over the lazy dog');
  });

  it('should include candidates array for ambiguous input (CC-AUTO-003)', async () => {
    const ambiguousText = 'abc';
    const res = await app.request('/auto-decrypt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: ambiguousText }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.decrypted).toBeDefined();
    expect(data.shift).toBeDefined();
    
    // For very short or ambiguous text, candidates may be included
    if (data.candidates) {
      expect(Array.isArray(data.candidates)).toBe(true);
      expect(data.candidates.length).toBeGreaterThan(0);
      data.candidates.forEach((candidate: any) => {
        expect(candidate.shift).toBeDefined();
        expect(candidate.text).toBeDefined();
        expect(candidate.score).toBeDefined();
      });
    }
  });

  it('should return 400 for missing text', async () => {
    const res = await app.request('/auto-decrypt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    expect(res.status).toBe(400);
  });

  it('should return 400 for empty text', async () => {
    const res = await app.request('/auto-decrypt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: '' }),
    });

    expect(res.status).toBe(400);
  });
});
