import { createHash, randomBytes } from 'crypto';
import { Pool } from 'pg';
import { config } from '../config';

const testTokens = new Map<string, { token: string; keyHash: string }>();
const testPool = new Pool({ connectionString: config.DATABASE_URL });

export async function setupTestAuth(testId: string = 'default'): Promise<string> {
  if (testTokens.has(testId)) {
    return testTokens.get(testId)!.token;
  }
  
  const testToken = 'test-token-' + testId + '-' + randomBytes(8).toString('hex');
  const keyHash = createHash('sha256').update(testToken).digest('hex');
  
  await testPool.query(
    'INSERT INTO api_keys (key_hash, name) VALUES ($1, $2) ON CONFLICT (key_hash) DO NOTHING',
    [keyHash, `test-${testId}`]
  );
  
  testTokens.set(testId, { token: testToken, keyHash });
  return testToken;
}

export async function cleanupTestAuth(testId: string = 'default') {
  const entry = testTokens.get(testId);
  if (entry) {
    await testPool.query('DELETE FROM api_keys WHERE key_hash = $1', [entry.keyHash]);
    testTokens.delete(testId);
  }
}

export async function cleanupAllTestAuth() {
  for (const [testId] of testTokens) {
    await cleanupTestAuth(testId);
  }
  await testPool.end();
}

export function getAuthHeader(token: string): Record<string, string> {
  return { 'Authorization': `Bearer ${token}` };
}
