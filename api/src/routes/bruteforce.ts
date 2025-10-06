import { Hono } from "hono";
import { z } from "zod";
import { bruteForce } from "../utils/caesar";
import { validator } from "../utils/validation";

const bruteforceRoute = new Hono();

const bruteforceSchema = z.object({
  text: z.string().min(1, "Text is required"),
});

bruteforceRoute.post("/", validator("json", bruteforceSchema), (c) => {
  const { text } = c.req.valid("json");
  const possibilities = bruteForce(text);

  return c.json({ possibilities });
});

export default bruteforceRoute;
