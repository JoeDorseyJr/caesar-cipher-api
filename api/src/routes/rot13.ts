import { Hono } from "hono";
import { z } from "zod";
import { encrypt } from "../utils/caesar";
import { validator } from "../utils/validation";

const rot13 = new Hono();

// Validation schema for rot13 endpoint (text only, shift is always 13)
const rot13Schema = z.object({
  text: z.string(),
});

// POST /rot13 - ROT13 cipher (fixed shift of 13)
rot13.post("/", validator("json", rot13Schema), (c) => {
  const { text } = c.req.valid("json");
  const encoded = encrypt(text, 13);

  return c.json({
    encoded,
    shift: 13,
  });
});

export default rot13;
