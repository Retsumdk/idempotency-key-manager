import { describe, test, expect } from "bun:test";
describe("idempotency-key-manager", () => {
  test("module loads", async () => { const m = await import("./index"); expect(m).toBeDefined(); });
});
