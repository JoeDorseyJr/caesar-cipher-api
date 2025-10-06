import { Context, Next } from 'hono';
import { createHash } from 'crypto';
import * as apiKeyRepo from '../repositories/apiKeyRepository';

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json(
      { code: 'UNAUTHORIZED', message: 'Missing or invalid Authorization header' },
      401
    );
  }
  
  const token = authHeader.substring(7);
  
  if (!token) {
    return c.json(
      { code: 'UNAUTHORIZED', message: 'Bearer token is required' },
      401
    );
  }
  
  try {
    const keyHash = createHash('sha256').update(token).digest('hex');
    const apiKey = await apiKeyRepo.findByKeyHash(keyHash);
    
    if (!apiKey) {
      return c.json(
        { code: 'UNAUTHORIZED', message: 'Invalid API key' },
        401
      );
    }
    
    c.set('user', { id: apiKey.id, name: apiKey.name });
    await next();
  } catch (error) {
    return c.json(
      { code: 'INTERNAL_ERROR', message: 'Authentication failed' },
      500
    );
  }
}
