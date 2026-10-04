import { getCsrfDecision } from "./middleware/csrf";

describe("CSRF middleware — all excluded paths", () => {
    const TOKEN = "test-csrf-token-123";

    const EXCLUDED_PATHS = [
        "/api/auth",
        "/api/auth/signin",
        "/api/auth/callback/google",
        "/api/csrf",
        "/api/csrf/generate",
        "/api/contact-us",
        "/api/contact-us/submit",
        "/api/links/click",
        "/api/links/click/track",
        "/api/analytics/aggregate",
        "/api/analytics/aggregate/batch",
    ];

    EXCLUDED_PATHS.forEach((pathname) => {
        it(`POST to ${pathname} → skip`, () => {
            expect(getCsrfDecision({
                method: "POST",
                pathname,
                requestToken: null,
                storedToken: TOKEN,
            })).toBe("skip");
        });
    });

    describe("NOT excluded paths", () => {
        const protectedPaths = [
            "/api/profile",
            "/api/links",
            "/api/links/update",
            "/api/workspace",
            "/api/user/settings",
        ];

        protectedPaths.forEach((pathname) => {
            it(`POST to ${pathname} without token → reject`, () => {
                expect(getCsrfDecision({
                    method: "POST",
                    pathname,
                    requestToken: null,
                    storedToken: TOKEN,
                })).toBe("reject");
            });
        });
    });
});
