/**
 * Integration tests combining CSRF core + middleware decision logic.
 */
import { generateCsrfToken, validateCsrfToken, CSRF_HEADER_NAME, CSRF_COOKIE_NAME } from "./csrf";
import { getCsrfDecision } from "./middleware/csrf";

describe("CSRF security integration", () => {
    it("a fresh token validates against itself", () => {
        const token = generateCsrfToken();
        expect(validateCsrfToken(token, token)).toBe(true);
    });

    it("fresh token enables POST request to be allowed", () => {
        const token = generateCsrfToken();
        const decision = getCsrfDecision({
            method: "POST",
            pathname: "/api/profile",
            requestToken: token,
            storedToken: token,
        });
        expect(decision).toBe("allow");
    });

    it("stale/forged token causes POST to be rejected", () => {
        const realToken = generateCsrfToken();
        const forgedToken = generateCsrfToken(); // Different random token
        const decision = getCsrfDecision({
            method: "POST",
            pathname: "/api/profile",
            requestToken: forgedToken,
            storedToken: realToken,
        });
        expect(decision).toBe("reject");
    });

    it("CSRF_HEADER_NAME is the correct header for token delivery", () => {
        expect(CSRF_HEADER_NAME).toBe("x-csrf-token");
        expect(CSRF_HEADER_NAME.startsWith("x-")).toBe(true); // custom header prevents CORS preflight bypass
    });

    it("cookie name and header name are different (defense in depth)", () => {
        expect(CSRF_COOKIE_NAME).not.toBe(CSRF_HEADER_NAME);
    });

    it("GET to protected route skips validation even with no token", () => {
        const decision = getCsrfDecision({
            method: "GET",
            pathname: "/api/profile/me",
            requestToken: null,
            storedToken: null,
        });
        expect(decision).toBe("skip");
    });

    it("concurrent tokens are unique (no reuse risk)", () => {
        const tokens = new Set(Array.from({ length: 20 }, () => generateCsrfToken()));
        expect(tokens.size).toBe(20);
    });
});
