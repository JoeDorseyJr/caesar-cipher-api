import { z } from "zod";

const configSchema = z.object({
  PORT: z.number().int().positive().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(10),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export type Config = z.infer<typeof configSchema>;

function loadConfig(): Config {
  const rawConfig = {
    PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
    DATABASE_URL: process.env.DATABASE_URL || "",
    JWT_SECRET: process.env.JWT_SECRET || "",
    NODE_ENV: (process.env.NODE_ENV as Config["NODE_ENV"]) || "development",
  };

  try {
    return configSchema.parse(rawConfig);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err) => {
          const path = err.path.join(".");
          return `  - ${path}: ${err.message}`;
        })
        .join("\n");

      throw new Error(
        `Configuration validation failed. Please check your environment variables:\n${missingVars}\n\n` +
          `See .env.example for required variables and their defaults.`,
      );
    }
    throw error;
  }
}

export const config = loadConfig();
