import { describe, expect, it } from "bun:test";
import packageJson from "../../package.json";
import { app } from "../app";

describe("GET /info", () => {
  it("should return service metadata with required fields (CC-INFO-001)", async () => {
    const res = await app.request("/info", {
      method: "GET",
    });

    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.name).toBeDefined();
    expect(data.version).toBeDefined();
    expect(data.endpoints).toBeDefined();
    expect(Array.isArray(data.endpoints)).toBe(true);
    expect(data.endpoints.length).toBeGreaterThan(0);
  });

  it("should source version from package.json (CC-INFO-002)", async () => {
    const res = await app.request("/info", {
      method: "GET",
    });

    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.version).toBe(packageJson.version);
    expect(data.name).toBe(packageJson.name);
  });

  it("should list all available endpoints", async () => {
    const res = await app.request("/info", {
      method: "GET",
    });

    expect(res.status).toBe(200);
    const data = await res.json();

    const paths = data.endpoints.map((e: any) => e.path);
    expect(paths).toContain("/health");
    expect(paths).toContain("/info");
    expect(paths).toContain("/encrypt");
    expect(paths).toContain("/decrypt");
    expect(paths).toContain("/encode");
    expect(paths).toContain("/rot13");
    expect(paths).toContain("/bruteforce");
    expect(paths).toContain("/auto-decrypt");
  });
});
