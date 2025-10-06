import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";

export function errorHandler(err: Error, c: Context) {
  // Handle Hono HTTP exceptions
  if (err instanceof HTTPException) {
    return c.json(
      {
        code: `HTTP_${err.status}`,
        message: err.message,
      },
      err.status,
    );
  }

  // Handle validation errors (from zod-validator)
  if (err.name === "ZodError") {
    return c.json(
      {
        code: "VALIDATION_ERROR",
        message: "Invalid request data",
      },
      400,
    );
  }

  // Handle generic errors
  console.error("Unhandled error:", err);
  return c.json(
    {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    },
    500,
  );
}
