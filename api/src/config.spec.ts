import { describe, test, expect } from 'bun:test';

describe('TypeScript strict mode validation', () => {
  test('basic test passes', () => {
    expect(true).toBe(true);
  });

  test('type checking works', () => {
    const value: string = 'test';
    expect(typeof value).toBe('string');
  });
});
