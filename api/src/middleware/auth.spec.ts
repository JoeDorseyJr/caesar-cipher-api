import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { createHash } from "crypto";
import { Pool } from "pg";
import { app } from "../app";
import { config } from "../config";

const testPool = new Pool({
  connectionString: config.DATABASE_URL,
});

let testToken: string;
let testKeyHash: string;

describe("Auth Middleware", () => {
  beforeAll(async () => {
    // Create test API key
    testToken = "test-token-" + Date.now();
    testKeyHash = createHash("sha256").update(testToken).digest("hex");

    await testPool.query(
      "INSERT INTO api_keys (key_hash, name) VALUES ($1, $2)",
      [testKeyHash, "test-auth-middleware"],
    );
  });

  afterAll(async () => {
    await testPool.query("DELETE FROM api_keys WHERE key_hash = $1", [
      testKeyHash,
    ]);
    await testPool.end();
  });

  it("should return 401 without Authorization header (CC-AUTH-001)", async () => {
    const res = await app.request("/encrypt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "test", shift: 3 }),
    });

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.code).toBe("UNAUTHORIZED");
    expect(data.message).toBeDefined();
  });

  it("should return 401 with invalid token", async () => {
    const res = await app.request("/encrypt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer invalid-token",
      },
      body: JSON.stringify({ text: "test", shift: 3 }),
    });

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.code).toBe("UNAUTHORIZED");
  });

  it("should return 200 with valid token (CC-AUTH-001)", async () => {
    const res = await app.request("/encrypt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${testToken}`,
      },
      body: JSON.stringify({ text: "Hello", shift: 3 }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.encrypted).toBe("Khoor");
  });

  it("should allow access to /health without auth", async () => {
    const res = await app.request("/health", {
      method: "GET",
    });

    expect(res.status).toBe(200);
  });

  it("should allow access to /info without auth", async () => {
    const res = await app.request("/info", {
      method: "GET",
    });

    expect(res.status).toBe(200);
  });
});
