import { describe, it, expect } from 'bun:test';
import { app } from '../app';

describe('POST /bruteforce', () => {
  it('should return all 26 possible shifts (CC-BRUTE-002)', async () => {
    const res = await app.request('/bruteforce', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Khoor' }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.possibilities).toBeDefined();
    expect(Object.keys(data.possibilities)).toHaveLength(26);
    
    // Verify keys are "0" through "25"
    for (let i = 0; i <= 25; i++) {
      expect(data.possibilities[i.toString()]).toBeDefined();
    }
  });

  it('should include original text at shift 0 (CC-BRUTE-003)', async () => {
    const originalText = 'Hello, World!';
    const res = await app.request('/bruteforce', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: originalText }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.possibilities['0']).toBe(originalText);
  });

  it('should accept sample input (CC-BRUTE-001)', async () => {
    const res = await app.request('/bruteforce', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Khoor, Zruog!' }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.possibilities['3']).toBe('Hello, World!');
  });

  it('should return 400 for missing text', async () => {
    const res = await app.request('/bruteforce', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    expect(res.status).toBe(400);
  });

  it('should return 400 for empty text', async () => {
    const res = await app.request('/bruteforce', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: '' }),
    });

    expect(res.status).toBe(400);
  });
});
