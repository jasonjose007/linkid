import { getCsrfDecision } from "./csrf";

describe("getCsrfDecision — HTTP method coverage", () => {
    const TOKEN = "secure-csrf-token-abc123";

    describe("protected methods", () => {
        const protectedMethods = ["POST", "PUT", "PATCH", "DELETE"];

        protectedMethods.forEach((method) => {
            it(`${method} with matching tokens → allow`, () => {
                expect(getCsrfDecision({
                    method,
                    pathname: "/api/profile",
                    requestToken: TOKEN,
                    storedToken: TOKEN,
                })).toBe("allow");
            });

            it(`${method} with no token → reject`, () => {
                expect(getCsrfDecision({
                    method,
                    pathname: "/api/profile",
                    requestToken: null,
                    storedToken: TOKEN,
                })).toBe("reject");
            });
        });
    });

    describe("non-protected methods → always skip", () => {
        const safeMethods = ["GET", "HEAD", "OPTIONS", "TRACE"];

        safeMethods.forEach((method) => {
            it(`${method} → skip regardless of tokens`, () => {
                expect(getCsrfDecision({
                    method,
                    pathname: "/api/profile",
                    requestToken: null,
                    storedToken: null,
                })).toBe("skip");
            });
        });
    });

    describe("path boundary matching", () => {
        it("exact excluded path → skip", () => {
            expect(getCsrfDecision({
                method: "POST",
                pathname: "/api/csrf",
                requestToken: null,
                storedToken: TOKEN,
            })).toBe("skip");
        });

        it("sub-path of excluded → skip", () => {
            expect(getCsrfDecision({
                method: "POST",
                pathname: "/api/csrf/generate",
                requestToken: null,
                storedToken: TOKEN,
            })).toBe("skip");
        });

        it("path that starts with excluded but differs → reject", () => {
            expect(getCsrfDecision({
                method: "POST",
                pathname: "/api/csrftoken",
                requestToken: null,
                storedToken: TOKEN,
            })).toBe("reject");
        });

        it("analytics aggregate → skip", () => {
            expect(getCsrfDecision({
                method: "POST",
                pathname: "/api/analytics/aggregate",
                requestToken: null,
                storedToken: TOKEN,
            })).toBe("skip");
        });
    });
});
