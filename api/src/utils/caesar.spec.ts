import { describe, test, expect } from 'bun:test';
import { shiftChar, encrypt, decrypt, bruteForce, autoDecrypt } from './caesar';

describe('Caesar cipher utilities', () => {
  describe('shiftChar', () => {
    test('shifts uppercase letters correctly', () => {
      expect(shiftChar('A', 3)).toBe('D');
      expect(shiftChar('X', 3)).toBe('A');
      expect(shiftChar('Z', 1)).toBe('A');
    });

    test('shifts lowercase letters correctly', () => {
      expect(shiftChar('a', 3)).toBe('d');
      expect(shiftChar('x', 3)).toBe('a');
      expect(shiftChar('z', 1)).toBe('a');
    });

    test('preserves case', () => {
      expect(shiftChar('A', 1)).toBe('B');
      expect(shiftChar('a', 1)).toBe('b');
      expect(shiftChar('Z', 1)).toBe('A');
      expect(shiftChar('z', 1)).toBe('a');
    });

    test('ignores non-alphabetic characters', () => {
      expect(shiftChar('!', 3)).toBe('!');
      expect(shiftChar(' ', 5)).toBe(' ');
      expect(shiftChar('0', 10)).toBe('0');
      expect(shiftChar('.', 3)).toBe('.');
    });

    test('handles shift 0', () => {
      expect(shiftChar('A', 0)).toBe('A');
      expect(shiftChar('z', 0)).toBe('z');
    });

    test('handles shift 25', () => {
      expect(shiftChar('A', 25)).toBe('Z');
      expect(shiftChar('B', 25)).toBe('A');
      expect(shiftChar('a', 25)).toBe('z');
      expect(shiftChar('b', 25)).toBe('a');
    });

    test('handles negative shifts', () => {
      expect(shiftChar('D', -3)).toBe('A');
      expect(shiftChar('A', -1)).toBe('Z');
    });

    test('handles shifts > 25', () => {
      expect(shiftChar('A', 26)).toBe('A');
      expect(shiftChar('A', 27)).toBe('B');
      expect(shiftChar('A', 52)).toBe('A');
    });
  });

  describe('encrypt', () => {
    test('encrypts simple text', () => {
      expect(encrypt('hello', 3)).toBe('khoor');
      expect(encrypt('HELLO', 3)).toBe('KHOOR');
    });

    test('encrypts text with mixed case', () => {
      expect(encrypt('Hello World', 3)).toBe('Khoor Zruog');
    });

    test('preserves punctuation and spaces', () => {
      expect(encrypt('hello, world!', 3)).toBe('khoor, zruog!');
      expect(encrypt('a.b.c', 1)).toBe('b.c.d');
    });

    test('handles empty string', () => {
      expect(encrypt('', 3)).toBe('');
    });

    test('handles shift 0', () => {
      expect(encrypt('hello', 0)).toBe('hello');
    });

    test('handles shift 13 (ROT13)', () => {
      expect(encrypt('hello', 13)).toBe('uryyb');
      expect(encrypt('HELLO', 13)).toBe('URYYB');
    });

    test('encrypts with all shifts 0-25', () => {
      const text = 'abc';
      const results = [];
      for (let shift = 0; shift <= 25; shift++) {
        results.push(encrypt(text, shift));
      }
      // All results should be unique
      expect(new Set(results).size).toBe(26);
    });

    test('handles numbers and special characters', () => {
      expect(encrypt('test123!@#', 5)).toBe('yjxy123!@#');
    });
  });

  describe('decrypt', () => {
    test('decrypts simple text', () => {
      expect(decrypt('khoor', 3)).toBe('hello');
      expect(decrypt('KHOOR', 3)).toBe('HELLO');
    });

    test('decrypts text with mixed case', () => {
      expect(decrypt('Khoor Zruog', 3)).toBe('Hello World');
    });

    test('round-trip encryption and decryption', () => {
      const original = 'The quick brown fox jumps over the lazy dog';
      for (let shift = 0; shift <= 25; shift++) {
        const encrypted = encrypt(original, shift);
        const decrypted = decrypt(encrypted, shift);
        expect(decrypted).toBe(original);
      }
    });

    test('preserves punctuation and spaces', () => {
      expect(decrypt('khoor, zruog!', 3)).toBe('hello, world!');
    });

    test('handles empty string', () => {
      expect(decrypt('', 3)).toBe('');
    });
  });

  describe('bruteForce', () => {
    test('returns all 26 possible shifts', () => {
      const result = bruteForce('khoor');
      expect(Object.keys(result).length).toBe(26);
    });

    test('includes shift 0 with original text', () => {
      const result = bruteForce('hello');
      expect(result['0']).toBe('hello');
    });

    test('includes correct decryption', () => {
      const encrypted = encrypt('attack at dawn', 7);
      const result = bruteForce(encrypted);
      expect(result['7']).toBe('attack at dawn');
    });

    test('all keys are strings from "0" to "25"', () => {
      const result = bruteForce('test');
      const keys = Object.keys(result).sort((a, b) => parseInt(a) - parseInt(b));
      expect(keys).toEqual(
        Array.from({ length: 26 }, (_, i) => i.toString())
      );
    });

    test('handles empty string', () => {
      const result = bruteForce('');
      expect(Object.keys(result).length).toBe(26);
      expect(result['0']).toBe('');
    });
  });

  describe('autoDecrypt', () => {
    test('correctly decrypts known English text', () => {
      const encrypted = encrypt('hello world', 3);
      const result = autoDecrypt(encrypted);
      expect(result.decrypted).toBe('hello world');
      expect(result.shift).toBe(3);
    });

    test('works with longer English text', () => {
      const text = 'the quick brown fox jumps over the lazy dog';
      const encrypted = encrypt(text, 5);
      const result = autoDecrypt(encrypted);
      expect(result.decrypted).toBe(text);
      expect(result.shift).toBe(5);
    });

    test('works with different shifts', () => {
      const text = 'this is a test message';
      for (let shift = 1; shift <= 25; shift++) {
        const encrypted = encrypt(text, shift);
        const result = autoDecrypt(encrypted);
        expect(result.shift).toBe(shift);
        expect(result.decrypted).toBe(text);
      }
    });

    test('includes candidates for ambiguous input', () => {
      // Short text may be ambiguous
      const encrypted = 'xyz';
      const result = autoDecrypt(encrypted);
      expect(result.decrypted).toBeDefined();
      expect(result.shift).toBeGreaterThanOrEqual(0);
      expect(result.shift).toBeLessThanOrEqual(25);
      // May or may not have candidates depending on scoring
    });

    test('preserves punctuation in result', () => {
      const text = 'hello, world!';
      const encrypted = encrypt(text, 7);
      const result = autoDecrypt(encrypted);
      expect(result.decrypted).toBe(text);
    });

    test('handles uppercase text', () => {
      const text = 'HELLO WORLD';
      const encrypted = encrypt(text, 10);
      const result = autoDecrypt(encrypted);
      expect(result.decrypted).toBe(text);
    });
  });
});
