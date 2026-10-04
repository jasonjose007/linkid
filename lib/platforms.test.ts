import { normalizeUrl, detectPlatform, isKnownPlatform, validatePlatformUrl } from "./platforms";

describe("normalizeUrl", () => {
    it("adds https:// when scheme is missing", () => {
        expect(normalizeUrl("example.com")).toMatch(/^https:\/\//);
    });

    it("preserves existing https scheme", () => {
        expect(normalizeUrl("https://example.com")).toBe("https://example.com");
    });

    it("preserves existing http scheme", () => {
        expect(normalizeUrl("http://example.com")).toContain("http://");
    });

    it("trims whitespace", () => {
        expect(normalizeUrl("  https://example.com  ")).toBe("https://example.com");
    });
});

describe("detectPlatform", () => {
    it("detects GitHub URL", () => {
        expect(detectPlatform("https://github.com/torvalds")).toBe("github");
    });

    it("detects LinkedIn URL", () => {
        expect(detectPlatform("https://linkedin.com/in/someone")).toBe("linkedin");
    });

    it("detects YouTube URL", () => {
        expect(detectPlatform("https://youtube.com/c/mychannel")).toBe("youtube");
    });

    it("returns website for unknown URL", () => {
        expect(detectPlatform("https://randomsite.com")).toBe("website");
    });
});

describe("isKnownPlatform", () => {
    it("returns true for github", () => {
        expect(isKnownPlatform("github")).toBe(true);
    });

    it("returns true for linkedin", () => {
        expect(isKnownPlatform("linkedin")).toBe(true);
    });

    it("returns false for unknown platform", () => {
        expect(isKnownPlatform("myspace")).toBe(false);
    });

    it("returns false for empty string", () => {
        expect(isKnownPlatform("")).toBe(false);
    });
});

describe("validatePlatformUrl", () => {
    it("validates a correct GitHub URL", () => {
        expect(validatePlatformUrl("github", "https://github.com/vishnukothakapu")).toBe(true);
    });

    it("rejects a GitHub URL with wrong domain", () => {
        expect(validatePlatformUrl("github", "https://gitlab.com/user")).toBe(false);
    });

    it("validates a LinkedIn URL", () => {
        expect(validatePlatformUrl("linkedin", "https://linkedin.com/in/user123")).toBe(true);
    });
});
