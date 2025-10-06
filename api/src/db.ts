import { Pool } from "pg";
import { config } from "./config";

export const pool = new Pool({
  connectionString: config.DATABASE_URL,
});

pool.on("error", (err) => {
  console.error("Unexpected database error:", err);
});

export async function query<T = any>(
  text: string,
  params?: any[],
): Promise<T[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows;
  } catch (error) {
    throw new Error(
      `Database query failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  } finally {
    client.release();
  }
}
