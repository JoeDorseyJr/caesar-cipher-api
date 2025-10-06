import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { Pool } from "pg";
import { config } from "../config";
import * as apiKeyRepo from "./apiKeyRepository";

const testPool = new Pool({
  connectionString: config.DATABASE_URL,
});

describe("API Key Repository", () => {
  beforeAll(async () => {
    // Clean up test data
    await testPool.query("DELETE FROM api_keys WHERE name LIKE $1", ["test-%"]);
  });

  afterAll(async () => {
    // Clean up test data
    await testPool.query("DELETE FROM api_keys WHERE name LIKE $1", ["test-%"]);
    await testPool.end();
  });

  it("should create an API key", async () => {
    const keyHash = "test-hash-" + Date.now();
    const name = "test-key-create";

    const apiKey = await apiKeyRepo.createApiKey(keyHash, name);

    expect(apiKey.key_hash).toBe(keyHash);
    expect(apiKey.name).toBe(name);
    expect(apiKey.active).toBe(true);
  });

  it("should find API key by hash", async () => {
    const keyHash = "test-hash-find-" + Date.now();
    const name = "test-key-find";

    await apiKeyRepo.createApiKey(keyHash, name);
    const found = await apiKeyRepo.findByKeyHash(keyHash);

    expect(found).not.toBeNull();
    expect(found?.key_hash).toBe(keyHash);
    expect(found?.name).toBe(name);
  });

  it("should return null for non-existent key", async () => {
    const found = await apiKeyRepo.findByKeyHash("non-existent-key");
    expect(found).toBeNull();
  });

  it("should not find inactive keys", async () => {
    const keyHash = "test-hash-inactive-" + Date.now();
    const name = "test-key-inactive";

    await apiKeyRepo.createApiKey(keyHash, name);
    await testPool.query(
      "UPDATE api_keys SET active = false WHERE key_hash = $1",
      [keyHash],
    );

    const found = await apiKeyRepo.findByKeyHash(keyHash);
    expect(found).toBeNull();
  });
});
