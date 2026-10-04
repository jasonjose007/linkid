import { getCsrfCookieOptions, CSRF_TOKEN_MAX_AGE_SECONDS } from "./csrf";

describe("getCsrfCookieOptions", () => {
    it("returns httpOnly: true", () => {
        expect(getCsrfCookieOptions().httpOnly).toBe(true);
    });

    it("returns sameSite: strict", () => {
        expect(getCsrfCookieOptions().sameSite).toBe("strict");
    });

    it("returns path: /", () => {
        expect(getCsrfCookieOptions().path).toBe("/");
    });

    it("maxAge matches CSRF_TOKEN_MAX_AGE_SECONDS constant", () => {
        expect(getCsrfCookieOptions().maxAge).toBe(CSRF_TOKEN_MAX_AGE_SECONDS);
    });

    it("CSRF_TOKEN_MAX_AGE_SECONDS is 1 hour (3600 seconds)", () => {
        expect(CSRF_TOKEN_MAX_AGE_SECONDS).toBe(3600);
    });

    it("secure flag is set in production", () => {
        const originalEnv = process.env.NODE_ENV;
        Object.defineProperty(process.env, "NODE_ENV", { value: "production", writable: true });
        expect(getCsrfCookieOptions().secure).toBe(true);
        Object.defineProperty(process.env, "NODE_ENV", { value: originalEnv, writable: true });
    });
});

describe("authErrors constants", () => {
    it("TWO_FACTOR_REQUIRED_ERROR is defined", async () => {
        const { TWO_FACTOR_REQUIRED_ERROR } = await import("./authErrors");
        expect(TWO_FACTOR_REQUIRED_ERROR).toBe("2FA_REQUIRED");
    });

    it("TWO_FACTOR_INVALID_CODE_ERROR is defined", async () => {
        const { TWO_FACTOR_INVALID_CODE_ERROR } = await import("./authErrors");
        expect(TWO_FACTOR_INVALID_CODE_ERROR).toBe("2FA_CODE_INVALID");
    });
});
