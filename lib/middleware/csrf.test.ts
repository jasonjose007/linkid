import { getCsrfDecision } from "./csrf";

describe("getCsrfDecision", () => {
    const TOKEN = "valid-token-abc";

    it("skips GET requests (non-mutating)", () => {
        const decision = getCsrfDecision({
            method: "GET",
            pathname: "/api/profile",
            requestToken: null,
            storedToken: null,
        });
        expect(decision).toBe("skip");
    });

    it("skips HEAD requests", () => {
        const decision = getCsrfDecision({
            method: "HEAD",
            pathname: "/api/profile",
            requestToken: null,
            storedToken: null,
        });
        expect(decision).toBe("skip");
    });

    it("skips POST to /api/auth (excluded path)", () => {
        const decision = getCsrfDecision({
            method: "POST",
            pathname: "/api/auth",
            requestToken: null,
            storedToken: null,
        });
        expect(decision).toBe("skip");
    });

    it("skips POST to /api/auth/signin (sub-path of excluded)", () => {
        const decision = getCsrfDecision({
            method: "POST",
            pathname: "/api/auth/signin",
            requestToken: null,
            storedToken: null,
        });
        expect(decision).toBe("skip");
    });

    it("skips POST to /api/links/click (excluded)", () => {
        const decision = getCsrfDecision({
            method: "POST",
            pathname: "/api/links/click",
            requestToken: null,
            storedToken: null,
        });
        expect(decision).toBe("skip");
    });

    it("rejects POST with no token", () => {
        const decision = getCsrfDecision({
            method: "POST",
            pathname: "/api/profile",
            requestToken: null,
            storedToken: TOKEN,
        });
        expect(decision).toBe("reject");
    });

    it("rejects POST with mismatched tokens", () => {
        const decision = getCsrfDecision({
            method: "POST",
            pathname: "/api/profile",
            requestToken: "wrong-token",
            storedToken: TOKEN,
        });
        expect(decision).toBe("reject");
    });

    it("allows POST with matching tokens", () => {
        const decision = getCsrfDecision({
            method: "POST",
            pathname: "/api/profile",
            requestToken: TOKEN,
            storedToken: TOKEN,
        });
        expect(decision).toBe("allow");
    });

    it("allows DELETE with matching tokens", () => {
        const decision = getCsrfDecision({
            method: "DELETE",
            pathname: "/api/links/123",
            requestToken: TOKEN,
            storedToken: TOKEN,
        });
        expect(decision).toBe("allow");
    });

    it("does NOT skip /api/contact-us-admin (strict boundary match)", () => {
        const decision = getCsrfDecision({
            method: "POST",
            pathname: "/api/contact-us-admin",
            requestToken: null,
            storedToken: TOKEN,
        });
        expect(decision).toBe("reject");
    });
});
