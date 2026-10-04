import { generateCsrfToken, validateCsrfToken } from "./csrf";

describe("CSRF token security properties", () => {
    describe("generateCsrfToken — entropy", () => {
        it("generates tokens with sufficient entropy (no obvious patterns)", () => {
            const tokens = Array.from({ length: 10 }, () => generateCsrfToken());
            const unique = new Set(tokens);
            expect(unique.size).toBe(10);
        });

        it("tokens are hex-encoded (only 0-9, a-f)", () => {
            const token = generateCsrfToken();
            expect(token).toMatch(/^[0-9a-f]+$/);
        });

        it("first half differs from second half (no repeated patterns)", () => {
            const token = generateCsrfToken();
            const half = token.length / 2;
            expect(token.slice(0, half)).not.toBe(token.slice(half));
        });
    });

    describe("validateCsrfToken — constant-time comparison correctness", () => {
        it("validates a freshly generated token against itself", () => {
            const token = generateCsrfToken();
            expect(validateCsrfToken(token, token)).toBe(true);
        });

        it("rejects when one character differs at start", () => {
            const token = generateCsrfToken();
            const modified = token[0] === "a" ? "b" + token.slice(1) : "a" + token.slice(1);
            expect(validateCsrfToken(modified, token)).toBe(false);
        });

        it("rejects when one character differs at end", () => {
            const token = generateCsrfToken();
            const modified = token.slice(0, -1) + (token[token.length - 1] === "a" ? "b" : "a");
            expect(validateCsrfToken(modified, token)).toBe(false);
        });

        it("rejects token that is longer by one byte", () => {
            const token = generateCsrfToken();
            expect(validateCsrfToken(token + "a", token)).toBe(false);
        });

        it("rejects when only the stored token is undefined", () => {
            const token = generateCsrfToken();
            expect(validateCsrfToken(token, undefined)).toBe(false);
        });
    });
});
