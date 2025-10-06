import { Hono } from "hono";
import { z } from "zod";
import { decrypt as caesarDecrypt } from "../utils/caesar";
import { validator } from "../utils/validation";

const decrypt = new Hono();

// Request schema
const decryptSchema = z.object({
  text: z.string().min(1, "Text is required"),
  shift: z.number().int().min(0).max(25, "Shift must be between 0 and 25"),
});

decrypt.post("/", validator("json", decryptSchema), (c) => {
  const { text, shift } = c.req.valid("json");

  const decrypted = caesarDecrypt(text, shift);

  return c.json({
    decrypted,
    shift,
  });
});

export default decrypt;
