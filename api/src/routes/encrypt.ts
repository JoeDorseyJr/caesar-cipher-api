import { Hono } from "hono";
import { z } from "zod";
import { encrypt as caesarEncrypt } from "../utils/caesar";
import { validator } from "../utils/validation";

const encrypt = new Hono();

// Request schema
const encryptSchema = z.object({
  text: z.string().min(1, "Text is required"),
  shift: z.number().int().min(0).max(25, "Shift must be between 0 and 25"),
});

encrypt.post("/", validator("json", encryptSchema), (c) => {
  const { text, shift } = c.req.valid("json");

  const encrypted = caesarEncrypt(text, shift);

  return c.json({
    encrypted,
    shift,
  });
});

export default encrypt;
