import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { encrypt } from '../utils/caesar';

const encode = new Hono();

// Validation schema for encode endpoint (shift defaults to 3)
const encodeSchema = z.object({
  text: z.string(),
  shift: z.number().int().min(0).max(25).optional().default(3),
});

// POST /encode - encrypt with default shift of 3
encode.post('/', zValidator('json', encodeSchema), (c) => {
  const { text, shift } = c.req.valid('json');
  const encoded = encrypt(text, shift);
  
  return c.json({
    encoded,
    shift,
  });
});

export default encode;
