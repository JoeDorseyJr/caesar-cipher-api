/**
 * Core Caesar cipher utilities
 * Pure functions for encryption, decryption, and shift operations
 */

/**
 * Shifts a single character by the specified amount
 * Preserves case and ignores non-alphabetic characters
 */
export function shiftChar(char: string, shift: number): string {
  // Normalize shift to 0-25 range
  const normalizedShift = ((shift % 26) + 26) % 26;
  
  if (char >= 'A' && char <= 'Z') {
    // Uppercase letter
    const charCode = char.charCodeAt(0);
    const shifted = ((charCode - 65 + normalizedShift) % 26) + 65;
    return String.fromCharCode(shifted);
  } else if (char >= 'a' && char <= 'z') {
    // Lowercase letter
    const charCode = char.charCodeAt(0);
    const shifted = ((charCode - 97 + normalizedShift) % 26) + 97;
    return String.fromCharCode(shifted);
  }
  
  // Non-alphabetic character, return unchanged
  return char;
}

/**
 * Encrypts text using Caesar cipher with the specified shift
 */
export function encrypt(text: string, shift: number): string {
  return text.split('').map(char => shiftChar(char, shift)).join('');
}

/**
 * Decrypts text using Caesar cipher with the specified shift
 */
export function decrypt(text: string, shift: number): string {
  // Decryption is encryption with negative shift
  return encrypt(text, -shift);
}

/**
 * Generates all possible decryptions (shifts 0-25)
 * Returns a map of shift values to decrypted text
 */
export function bruteForce(text: string): Record<string, string> {
  const results: Record<string, string> = {};
  
  for (let shift = 0; shift <= 25; shift++) {
    results[shift.toString()] = decrypt(text, shift);
  }
  
  return results;
}

/**
 * English letter frequency (approximate percentages)
 */
const ENGLISH_FREQ: Record<string, number> = {
  'e': 12.70, 't': 9.06, 'a': 8.17, 'o': 7.51, 'i': 6.97,
  'n': 6.75, 's': 6.33, 'h': 6.09, 'r': 5.99, 'd': 4.25,
  'l': 4.03, 'c': 2.78, 'u': 2.76, 'm': 2.41, 'w': 2.36,
  'f': 2.23, 'g': 2.02, 'y': 1.97, 'p': 1.93, 'b': 1.29,
  'v': 0.98, 'k': 0.77, 'j': 0.15, 'x': 0.15, 'q': 0.10, 'z': 0.07
};

/**
 * Common English words for validation
 */
const COMMON_WORDS = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at'];

/**
 * Calculates a score based on English letter frequency
 * Higher score indicates more likely to be English text
 */
function calculateFrequencyScore(text: string): number {
  const lowerText = text.toLowerCase();
  const letters = lowerText.replace(/[^a-z]/g, '');
  
  if (letters.length === 0) return 0;
  
  let score = 0;
  for (const char of letters) {
    score += ENGLISH_FREQ[char] || 0;
  }
  
  return score / letters.length;
}

/**
 * Common English bigrams for additional scoring
 */
const COMMON_BIGRAMS = ['th', 'he', 'in', 'er', 'an', 're', 'nd', 'on', 'en', 'at', 'ed', 'es', 'or', 'te', 'is'];

/**
 * Calculates bigram score (counts common two-letter sequences)
 */
function calculateBigramScore(text: string): number {
  const lowerText = text.toLowerCase();
  let score = 0;
  
  for (let i = 0; i < lowerText.length - 1; i++) {
    const bigram = lowerText.substring(i, i + 2);
    if (COMMON_BIGRAMS.includes(bigram)) {
      score++;
    }
  }
  
  return score;
}

/**
 * Calculates word score (counts common English words)
 */
function calculateWordScore(text: string): number {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  let score = 0;
  
  for (const word of words) {
    const cleanWord = word.replace(/[^a-z]/g, '');
    if (COMMON_WORDS.includes(cleanWord)) {
      score += 2; // Weight common words heavily
    }
  }
  
  return score;
}

/**
 * Candidate result for auto-decryption
 */
export interface DecryptionCandidate {
  shift: number;
  text: string;
  score: number;
}

/**
 * Attempts to automatically decrypt Caesar cipher text
 * Uses frequency analysis to determine most likely plaintext
 */
export function autoDecrypt(text: string): {
  decrypted: string;
  shift: number;
  candidates?: DecryptionCandidate[];
} {
  const candidates: DecryptionCandidate[] = [];
  
  // Try all possible shifts
  for (let shift = 0; shift <= 25; shift++) {
    const decrypted = decrypt(text, shift);
    const freqScore = calculateFrequencyScore(decrypted);
    const bigramScore = calculateBigramScore(decrypted);
    const wordScore = calculateWordScore(decrypted);
    
    // Combined score: frequency analysis + bigram bonus + word bonus
    const totalScore = freqScore + (bigramScore * 0.5) + (wordScore * 2);
    
    candidates.push({
      shift,
      text: decrypted,
      score: totalScore,
    });
  }
  
  // Sort by score (highest first)
  candidates.sort((a, b) => b.score - a.score);
  
  const best = candidates[0];
  
  // If the best score is significantly higher than the second best,
  // we're confident. Otherwise, include top candidates.
  const includeAlternatives = candidates.length > 1 && 
    (best.score - candidates[1].score) < 1.0;
  
  return {
    decrypted: best.text,
    shift: best.shift,
    ...(includeAlternatives && {
      candidates: candidates.slice(0, 3).map(c => ({
        shift: c.shift,
        text: c.text,
        score: c.score,
      })),
    }),
  };
}
