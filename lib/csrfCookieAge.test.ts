import { getCsrfCookieOptions, CSRF_TOKEN_MAX_AGE_SECONDS, CSRF_COOKIE_NAME } from "./csrf";

describe("CSRF cookie configuration security properties", () => {
    it("max age is exactly 1 hour (3600 seconds)", () => {
        expect(CSRF_TOKEN_MAX_AGE_SECONDS).toBe(3600);
    });

    it("max age in milliseconds would be 3600000ms", () => {
        expect(CSRF_TOKEN_MAX_AGE_SECONDS * 1000).toBe(3_600_000);
    });

    it("cookie is httpOnly (inaccessible to JavaScript)", () => {
        expect(getCsrfCookieOptions().httpOnly).toBe(true);
    });

    it("cookie has SameSite: strict (CSRF protection)", () => {
        expect(getCsrfCookieOptions().sameSite).toBe("strict");
    });

    it("cookie path is root (applies to all routes)", () => {
        expect(getCsrfCookieOptions().path).toBe("/");
    });

    it("maxAge matches constant", () => {
        expect(getCsrfCookieOptions().maxAge).toBe(CSRF_TOKEN_MAX_AGE_SECONDS);
    });

    it("cookie name does not contain spaces", () => {
        expect(CSRF_COOKIE_NAME).not.toContain(" ");
    });

    it("cookie name uses underscore separator (standard HTTP cookie format)", () => {
        expect(CSRF_COOKIE_NAME).toMatch(/^[a-z_]+$/);
    });

    it("getCsrfCookieOptions returns a plain object with all required fields", () => {
        const opts = getCsrfCookieOptions();
        expect(opts).toHaveProperty("httpOnly");
        expect(opts).toHaveProperty("maxAge");
        expect(opts).toHaveProperty("path");
        expect(opts).toHaveProperty("sameSite");
        expect(opts).toHaveProperty("secure");
    });
});
