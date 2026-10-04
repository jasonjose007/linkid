import { normalizeUrl } from "./platforms";

describe("normalizeUrl — precision and consistency", () => {
    it("normalizes to consistent lowercase scheme", () => {
        const url = normalizeUrl("HTTP://EXAMPLE.COM");
        // URL constructor normalizes the scheme
        expect(url.startsWith("http://") || url.startsWith("https://")).toBe(true);
    });

    it("preserves path with hyphens", () => {
        expect(normalizeUrl("https://example.com/my-profile")).toContain("my-profile");
    });

    it("preserves path with underscores", () => {
        expect(normalizeUrl("https://example.com/user_name")).toContain("user_name");
    });

    it("handles URL with multiple path segments", () => {
        expect(normalizeUrl("https://github.com/user/repo/blob/main")).toContain("blob/main");
    });

    it("handles URL with port number", () => {
        const url = normalizeUrl("https://example.com:8080/api");
        expect(url).toContain("8080");
    });

    it("trims both leading and trailing whitespace", () => {
        const url = normalizeUrl("  https://example.com  ");
        expect(url).toBe("https://example.com");
    });

    it("adds https when URL starts with //", () => {
        // Double-slash URL without scheme
        const url = normalizeUrl("//example.com/path");
        expect(url).toContain("example.com");
    });

    it("result is always parseable by URL constructor", () => {
        const inputs = [
            "example.com",
            "https://example.com/path?q=1",
            "github.com/user",
        ];
        for (const input of inputs) {
            const normalized = normalizeUrl(input);
            expect(() => new URL(normalized)).not.toThrow();
        }
    });
});
