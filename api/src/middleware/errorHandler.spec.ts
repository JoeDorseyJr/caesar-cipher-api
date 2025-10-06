import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { app } from "../app";
import {
  cleanupTestAuth,
  getAuthHeader,
  setupTestAuth,
} from "../test-helpers/auth";

let authToken: string;

describe("Error Handler (NFR-003)", () => {
  beforeAll(async () => {
    authToken = await setupTestAuth("error-handler");
  });

  afterAll(async () => {
    await cleanupTestAuth("error-handler");
  });

  it("should return structured error for validation failure", async () => {
    const res = await app.request("/encrypt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(authToken),
      },
      body: JSON.stringify({ text: "test" }), // missing shift
    });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.code).toBeDefined();
    expect(data.message).toBeDefined();
  });

  it("should return structured error for auth failure", async () => {
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

  it("should return structured error for invalid shift range", async () => {
    const res = await app.request("/encrypt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(authToken),
      },
      body: JSON.stringify({ text: "test", shift: 26 }),
    });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.code).toBeDefined();
    expect(data.message).toBeDefined();
  });
});
