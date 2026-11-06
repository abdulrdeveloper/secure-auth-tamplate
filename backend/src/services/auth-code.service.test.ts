import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { AuthCodeData, AuthCodeStore } from "./auth-code.service.js";

// redis.service.ts constructs the Upstash client at import time; provide
// placeholder credentials so loading the module never depends on a real env.
process.env.UPSTASH_REDIS_REST_URL ??= "https://example.upstash.io";
process.env.UPSTASH_REDIS_REST_TOKEN ??= "test-token";

const { consumeAuthCode } = await import("./auth-code.service.js");

const AUTH_CODE_PREFIX = "oauth_code:";

/**
 * In-memory stand-in for Redis. It only exposes GETDEL, so any regression
 * back to a separate GET + DEL sequence fails immediately.
 */
class InMemoryAuthCodeStore implements AuthCodeStore {
  private readonly entries = new Map<string, string>();
  private readonly automaticDeserialization: boolean;
  getdelCalls = 0;

  constructor(options: { automaticDeserialization?: boolean } = {}) {
    this.automaticDeserialization = options.automaticDeserialization ?? true;
  }

  seed(code: string, value: string): void {
    this.entries.set(`${AUTH_CODE_PREFIX}${code}`, value);
  }

  has(code: string): boolean {
    return this.entries.has(`${AUTH_CODE_PREFIX}${code}`);
  }

  async getdel<TData>(key: string): Promise<TData | null> {
    this.getdelCalls++;

    // Like Redis, GETDEL reads and removes the key in a single step.
    const raw = this.entries.get(key);
    this.entries.delete(key);

    // Yield before responding so concurrent callers genuinely interleave.
    await new Promise((resolve) => setImmediate(resolve));

    if (raw === undefined) {
      return null;
    }

    if (!this.automaticDeserialization) {
      return raw as TData;
    }

    // Mirrors @upstash/redis automatic deserialization.
    try {
      return JSON.parse(raw) as TData;
    } catch {
      return raw as TData;
    }
  }
}

const sampleData = (): AuthCodeData => ({
  userId: "user-123",
  clientId: "client-abc",
  redirectUri: "https://client.example.com/callback",
  scope: ["openid", "profile", "email"],
  createdAt: 1_700_000_000_000,
});

describe("consumeAuthCode", () => {
  it("returns the stored data and removes the code atomically", async () => {
    const store = new InMemoryAuthCodeStore();
    const data = sampleData();
    store.seed("code-1", JSON.stringify(data));

    const result = await consumeAuthCode("code-1", store);

    assert.deepEqual(result, data);
    assert.equal(store.has("code-1"), false);
    assert.equal(store.getdelCalls, 1);
  });

  it("rejects a second redemption of the same code", async () => {
    const store = new InMemoryAuthCodeStore();
    store.seed("code-2", JSON.stringify(sampleData()));

    const first = await consumeAuthCode("code-2", store);
    const second = await consumeAuthCode("code-2", store);

    assert.notEqual(first, null);
    assert.equal(second, null);
  });

  it("allows only one of many concurrent redemptions to succeed", async () => {
    const store = new InMemoryAuthCodeStore();
    const data = sampleData();
    store.seed("code-3", JSON.stringify(data));

    const results = await Promise.all(
      Array.from({ length: 25 }, () => consumeAuthCode("code-3", store))
    );

    const redeemed = results.filter((result) => result !== null);
    assert.equal(redeemed.length, 1);
    assert.deepEqual(redeemed[0], data);
    assert.equal(store.has("code-3"), false);
    assert.equal(store.getdelCalls, 25);
  });

  it("returns null for an unknown code", async () => {
    const store = new InMemoryAuthCodeStore();

    const result = await consumeAuthCode("missing", store);

    assert.equal(result, null);
  });

  it("parses raw string payloads when automatic deserialization is disabled", async () => {
    const store = new InMemoryAuthCodeStore({ automaticDeserialization: false });
    const data = sampleData();
    store.seed("code-4", JSON.stringify(data));

    const result = await consumeAuthCode("code-4", store);

    assert.deepEqual(result, data);
    assert.equal(store.has("code-4"), false);
  });

  it("returns null and still removes the code when the payload is malformed", async () => {
    const store = new InMemoryAuthCodeStore();
    store.seed("code-5", "{not-json");

    const result = await consumeAuthCode("code-5", store);

    assert.equal(result, null);
    assert.equal(store.has("code-5"), false);
  });
});
