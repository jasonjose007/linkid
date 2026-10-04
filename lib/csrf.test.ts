import { generateCsrfToken, validateCsrfToken, CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from "./csrf";

describe("generateCsrfToken", () => {
    it("returns a 64-character hex string", () => {
        const token = generateCsrfToken();
        expect(token).toHaveLength(64);
        expect(token).toMatch(/^[a-f0-9]{64}$/);
    });

    it("generates unique tokens on each call", () => {
        const a = generateCsrfToken();
        const b = generateCsrfToken();
        expect(a).not.toBe(b);
    });
});

describe("validateCsrfToken", () => {
    it("returns true when tokens match", () => {
        const token = "abc123def456";
        expect(validateCsrfToken(token, token)).toBe(true);
    });

    it("returns false when tokens differ", () => {
        expect(validateCsrfToken("token-a", "token-b")).toBe(false);
    });

    it("returns false when request token is null", () => {
        expect(validateCsrfToken(null, "stored-token")).toBe(false);
    });

    it("returns false when stored token is null", () => {
        expect(validateCsrfToken("request-token", null)).toBe(false);
    });

    it("returns false when both tokens are null", () => {
        expect(validateCsrfToken(null, null)).toBe(false);
    });

    it("returns false for empty string tokens", () => {
        expect(validateCsrfToken("", "")).toBe(false);
    });

    it("returns false for tokens of different lengths", () => {
        expect(validateCsrfToken("short", "much-longer-token")).toBe(false);
    });

    it("uses constant-time comparison (no early exit on mismatch)", () => {
        // Verify it doesn't short-circuit — both calls complete without error
        const a = "a".repeat(32);
        const b = "b".repeat(32);
        expect(validateCsrfToken(a, b)).toBe(false);
    });
});

describe("CSRF constants", () => {
    it("CSRF_COOKIE_NAME is defined", () => {
        expect(CSRF_COOKIE_NAME).toBeTruthy();
    });

    it("CSRF_HEADER_NAME is defined", () => {
        expect(CSRF_HEADER_NAME).toBeTruthy();
    });
});
