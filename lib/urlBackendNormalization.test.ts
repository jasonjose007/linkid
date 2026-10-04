import { validateUrlBackend } from "./urlValidation";

describe("validateUrlBackend — URL normalization", () => {
    it("normalizes trailing slash from root URL", () => {
        const result = validateUrlBackend("https://example.com/");
        expect(result.valid).toBe(true);
        if (result.valid) expect(result.normalizedUrl).toBe("https://example.com");
    });

    it("preserves path without trailing slash", () => {
        const result = validateUrlBackend("https://example.com/path/to/page");
        expect(result.valid).toBe(true);
        if (result.valid) expect(result.normalizedUrl).toContain("/path/to/page");
    });

    it("preserves query string parameters", () => {
        const result = validateUrlBackend("https://example.com?utm_source=test");
        expect(result.valid).toBe(true);
        if (result.valid) expect(result.normalizedUrl).toContain("utm_source=test");
    });

    it("preserves fragment identifier", () => {
        const result = validateUrlBackend("https://example.com/page#section");
        expect(result.valid).toBe(true);
        if (result.valid) expect(result.normalizedUrl).toContain("#section");
    });

    it("adds https:// prefix when scheme is missing", () => {
        const result = validateUrlBackend("example.com");
        expect(result.valid).toBe(true);
        if (result.valid) expect(result.normalizedUrl.startsWith("https://")).toBe(true);
    });

    it("preserves existing https scheme", () => {
        const result = validateUrlBackend("https://example.com");
        expect(result.valid).toBe(true);
        if (result.valid) expect(result.normalizedUrl).toBe("https://example.com");
    });

    it("preserves existing http scheme", () => {
        const result = validateUrlBackend("http://example.com");
        expect(result.valid).toBe(true);
        if (result.valid) expect(result.normalizedUrl.startsWith("http://")).toBe(true);
    });

    it("rejects ftp:// scheme (non http/https)", () => {
        expect(validateUrlBackend("ftp://files.example.com").valid).toBe(false);
    });
});
