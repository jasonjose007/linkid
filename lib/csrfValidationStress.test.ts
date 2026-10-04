import { generateCsrfToken, validateCsrfToken } from "./csrf";

describe("CSRF token validation — stress and invariants", () => {
    it("100 generated tokens all unique", () => {
        const tokens = new Set(Array.from({ length: 100 }, () => generateCsrfToken()));
        expect(tokens.size).toBe(100);
    });

    it("validates against self for all 10 generated tokens", () => {
        for (let i = 0; i < 10; i++) {
            const token = generateCsrfToken();
            expect(validateCsrfToken(token, token)).toBe(true);
        }
    });

    it("rejects all permutations of two different tokens", () => {
        const t1 = generateCsrfToken();
        const t2 = generateCsrfToken();
        expect(validateCsrfToken(t1, t2)).toBe(false);
        expect(validateCsrfToken(t2, t1)).toBe(false);
    });

    it("token length is always 64", () => {
        for (let i = 0; i < 10; i++) {
            expect(generateCsrfToken()).toHaveLength(64);
        }
    });

    it("validation is not susceptible to length extension: token + extra chars", () => {
        const token = generateCsrfToken();
        expect(validateCsrfToken(token + "a", token)).toBe(false);
        expect(validateCsrfToken(token, token + "a")).toBe(false);
    });

    it("validation is not susceptible to prefix sharing: first 63 chars match", () => {
        const token = generateCsrfToken();
        const almost = token.slice(0, 63) + (token[63] === "a" ? "b" : "a");
        expect(validateCsrfToken(almost, token)).toBe(false);
    });

    it("empty strings do not validate against each other", () => {
        expect(validateCsrfToken("", "")).toBe(false);
    });
});
