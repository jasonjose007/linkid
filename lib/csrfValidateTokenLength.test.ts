import { generateCsrfToken, validateCsrfToken } from "./csrf";

describe("CSRF token — length and format enforcement", () => {
    it("generated token is exactly 64 characters", () => {
        expect(generateCsrfToken()).toHaveLength(64);
    });

    it("validation requires both tokens to be exactly the same length", () => {
        const t64 = generateCsrfToken(); // 64 chars
        const t32 = t64.slice(0, 32);    // 32 chars
        expect(validateCsrfToken(t64, t32)).toBe(false);
        expect(validateCsrfToken(t32, t64)).toBe(false);
    });

    it("validation with 1-char tokens: same → true", () => {
        expect(validateCsrfToken("a", "a")).toBe(true);
    });

    it("validation with 1-char tokens: different → false", () => {
        expect(validateCsrfToken("a", "b")).toBe(false);
    });

    it("token with all same chars validates correctly", () => {
        const same = "a".repeat(64);
        expect(validateCsrfToken(same, same)).toBe(true);
    });

    it("token with all same chars but one different fails", () => {
        const base = "a".repeat(64);
        const modified = "a".repeat(63) + "b";
        expect(validateCsrfToken(base, modified)).toBe(false);
    });

    it("longer token never equals shorter token", () => {
        for (let len1 = 1; len1 <= 5; len1++) {
            for (let len2 = len1 + 1; len2 <= 6; len2++) {
                const t1 = "x".repeat(len1);
                const t2 = "x".repeat(len2);
                expect(validateCsrfToken(t1, t2)).toBe(false);
            }
        }
    });
});
