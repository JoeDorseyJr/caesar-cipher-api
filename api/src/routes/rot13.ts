import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { encrypt } from '../utils/caesar';

const rot13 = new Hono();

// Validation schema for rot13 endpoint (text only, shift is always 13)
const rot13Schema = z.object({
  text: z.string(),
});

// POST /rot13 - ROT13 cipher (fixed shift of 13)
rot13.post('/', zValidator('json', rot13Schema), (c) => {
  const { text } = c.req.valid('json');
  const encoded = encrypt(text, 13);
  
  return c.json({
    encoded,
    shift: 13,
  });
});

export default rot13;
