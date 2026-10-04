import { normalizeUrl, detectPlatform } from "./platforms";

describe("normalizeUrl — URL normalization behavior", () => {
    it("adds https:// when scheme is missing", () => {
        const url = normalizeUrl("example.com");
        expect(url.startsWith("https://")).toBe(true);
    });

    it("preserves existing https:// scheme", () => {
        expect(normalizeUrl("https://example.com")).toBe("https://example.com");
    });

    it("preserves http:// scheme (not upgraded)", () => {
        expect(normalizeUrl("http://example.com")).toContain("http://");
    });

    it("trims leading whitespace", () => {
        expect(normalizeUrl("  https://example.com")).toBe("https://example.com");
    });

    it("trims trailing whitespace", () => {
        expect(normalizeUrl("https://example.com  ")).toBe("https://example.com");
    });

    it("handles www. prefix correctly", () => {
        const url = normalizeUrl("www.github.com/user");
        expect(url).toContain("github.com");
    });

    it("preserves path components", () => {
        expect(normalizeUrl("https://github.com/user/repo")).toContain("user/repo");
    });

    it("preserves query string", () => {
        expect(normalizeUrl("https://example.com?q=test")).toContain("q=test");
    });

    it("preserved URL is parseable", () => {
        const url = normalizeUrl("https://example.com");
        expect(() => new URL(url)).not.toThrow();
    });
});

describe("normalizeUrl + detectPlatform interaction", () => {
    it("detects github from URL without scheme", () => {
        expect(detectPlatform("github.com/user")).toBe("github");
    });

    it("detects youtube from youtu.be shortlink", () => {
        expect(detectPlatform("youtu.be/videoId")).toBe("youtube");
    });
});
