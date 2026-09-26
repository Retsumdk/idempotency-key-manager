import { join } from "path";
import { describe, test, expect } from "bun:test";

const CLI = join(import.meta.dir, "../src/index.ts");

function run(args: string[]): { stdout: string; exitCode: number } {
  const proc = Bun.spawnSync(["bun", CLI, ...args]);
  return { stdout: proc.stdout.toString(), exitCode: proc.exitCode };
}

describe("idempotency-key-manager CLI", () => {
  test("runs end-to-end and reports connection, settings and completion", () => {
    const { stdout, exitCode } = run([]);
    expect(exitCode).toBe(0);
    expect(stdout).toContain("[idempotency-key-manager] Connected to https://api.example.com");
    expect(stdout).toContain("Timeout: 30000ms | Retries: 3");
    expect(stdout).toContain("[idempotency-key-manager] Done.");
  });

  test("loads overrides from config.json when present", () => {
    const proc = Bun.spawnSync(["bun", CLI], {
      cwd: join(import.meta.dir, "fixtures"),
    });
    const stdout = proc.stdout.toString();
    expect(proc.exitCode).toBe(0);
    expect(stdout).toContain("Connected to https://api.test.example");
    expect(stdout).toContain("Timeout: 5000ms | Retries: 1");
  });

  test("--verbose prints the verbose banner", () => {
    const { stdout } = run(["--verbose"]);
    expect(stdout).toContain("Verbose mode on");
  });
});
