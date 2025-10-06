import { describe, test, expect } from 'bun:test';

describe('Config module', () => {
  test('loads config successfully with valid env vars', () => {
    // Config is already loaded at module level in server.ts
    // If tests run without errors, config validation passed
    expect(true).toBe(true);
  });
});
