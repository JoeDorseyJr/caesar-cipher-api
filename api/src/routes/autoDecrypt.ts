import { Hono } from "hono";
import { z } from "zod";
import { autoDecrypt } from "../utils/caesar";
import { validator } from "../utils/validation";

const autoDecryptRoute = new Hono();

const autoDecryptSchema = z.object({
  text: z.string().min(1, "Text is required"),
});

autoDecryptRoute.post("/", validator("json", autoDecryptSchema), (c) => {
  const { text } = c.req.valid("json");
  const result = autoDecrypt(text);

  return c.json(result);
});

export default autoDecryptRoute;
