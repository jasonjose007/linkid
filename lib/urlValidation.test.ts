import { isSafeRedirectUrl, validateUrl, validateUrlBackend } from "./urlValidation";

describe("isSafeRedirectUrl", () => {
    it("accepts https URLs", () => {
        expect(isSafeRedirectUrl("https://example.com")).toBe(true);
    });

    it("accepts http URLs", () => {
        expect(isSafeRedirectUrl("http://example.com")).toBe(true);
    });

    it("rejects javascript: scheme", () => {
        expect(isSafeRedirectUrl("javascript:alert(1)")).toBe(false);
    });

    it("rejects data: scheme", () => {
        expect(isSafeRedirectUrl("data:text/html,<h1>hi</h1>")).toBe(false);
    });

    it("rejects invalid URL string", () => {
        expect(isSafeRedirectUrl("not a url")).toBe(false);
    });
});

describe("validateUrl", () => {
    it("accepts a valid https URL", () => {
        expect(validateUrl("https://example.com").valid).toBe(true);
    });

    it("accepts a URL without scheme (prepends https)", () => {
        expect(validateUrl("example.com").valid).toBe(true);
    });

    it("rejects empty string", () => {
        expect(validateUrl("").valid).toBe(false);
    });

    it("rejects non-http scheme", () => {
        expect(validateUrl("ftp://example.com").valid).toBe(false);
    });

    it("rejects domain with no TLD", () => {
        expect(validateUrl("https://localhost").valid).toBe(false);
    });
});

describe("validateUrlBackend", () => {
    it("accepts a valid https URL and normalizes it", () => {
        const result = validateUrlBackend("https://example.com");
        expect(result.valid).toBe(true);
        if (result.valid) expect(result.normalizedUrl).toBe("https://example.com");
    });

    it("rejects loopback IP", () => {
        const result = validateUrlBackend("http://127.0.0.1");
        expect(result.valid).toBe(false);
    });

    it("rejects private IP 192.168.x.x", () => {
        const result = validateUrlBackend("http://192.168.1.1");
        expect(result.valid).toBe(false);
    });

    it("rejects private IP 10.x.x.x", () => {
        const result = validateUrlBackend("http://10.0.0.1");
        expect(result.valid).toBe(false);
    });

    it("rejects IPv6 loopback ::1", () => {
        const result = validateUrlBackend("http://[::1]");
        expect(result.valid).toBe(false);
    });

    it("rejects empty URL", () => {
        expect(validateUrlBackend("").valid).toBe(false);
    });
});
