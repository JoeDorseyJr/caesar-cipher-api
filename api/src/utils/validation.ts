import { zValidator } from "@hono/zod-validator";
import type { ZodSchema } from "zod";

export function validator<T>(
  target: "json" | "query" | "param",
  schema: ZodSchema<T>,
) {
  return zValidator(target, schema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          code: "VALIDATION_ERROR",
          message: result.error.issues[0]?.message || "Invalid request data",
        },
        400,
      );
    }
  });
}
