import { isRedisConfigured } from "./profileCache";

describe("isRedisConfigured", () => {
    const originalUrl = process.env.UPSTASH_REDIS_REST_URL;
    const originalToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    afterEach(() => {
        process.env.UPSTASH_REDIS_REST_URL = originalUrl;
        process.env.UPSTASH_REDIS_REST_TOKEN = originalToken;
    });

    it("returns false when both env vars are missing", () => {
        delete process.env.UPSTASH_REDIS_REST_URL;
        delete process.env.UPSTASH_REDIS_REST_TOKEN;
        expect(isRedisConfigured()).toBe(false);
    });

    it("returns false when only URL is set", () => {
        process.env.UPSTASH_REDIS_REST_URL = "https://redis.example.com";
        delete process.env.UPSTASH_REDIS_REST_TOKEN;
        expect(isRedisConfigured()).toBe(false);
    });

    it("returns false when only token is set", () => {
        delete process.env.UPSTASH_REDIS_REST_URL;
        process.env.UPSTASH_REDIS_REST_TOKEN = "my-token";
        expect(isRedisConfigured()).toBe(false);
    });

    it("returns true when both env vars are set", () => {
        process.env.UPSTASH_REDIS_REST_URL = "https://redis.example.com";
        process.env.UPSTASH_REDIS_REST_TOKEN = "my-token";
        expect(isRedisConfigured()).toBe(true);
    });

    it("returns false when URL is empty string", () => {
        process.env.UPSTASH_REDIS_REST_URL = "";
        process.env.UPSTASH_REDIS_REST_TOKEN = "my-token";
        expect(isRedisConfigured()).toBe(false);
    });
});
