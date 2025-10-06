import { query } from '../db';

export interface ApiKey {
  id: number;
  key_hash: string;
  name: string;
  created_at: Date;
  active: boolean;
}

export async function findByKeyHash(keyHash: string): Promise<ApiKey | null> {
  const rows = await query<ApiKey>(
    'SELECT * FROM api_keys WHERE key_hash = $1 AND active = true LIMIT 1',
    [keyHash]
  );
  return rows[0] || null;
}

export async function createApiKey(keyHash: string, name: string): Promise<ApiKey> {
  const rows = await query<ApiKey>(
    'INSERT INTO api_keys (key_hash, name) VALUES ($1, $2) RETURNING *',
    [keyHash, name]
  );
  return rows[0];
}
