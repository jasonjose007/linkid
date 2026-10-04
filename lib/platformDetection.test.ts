import { detectPlatform, normalizeUrl } from "./platforms";

describe("detectPlatform — comprehensive URL detection", () => {
    it("detects GitHub", () => {
        expect(detectPlatform("https://github.com/user")).toBe("github");
    });

    it("detects GitLab", () => {
        expect(detectPlatform("https://gitlab.com/user")).toBe("gitlab");
    });

    it("detects Instagram", () => {
        expect(detectPlatform("https://instagram.com/user123")).toBe("instagram");
    });

    it("detects TikTok", () => {
        expect(detectPlatform("https://tiktok.com/@creator")).toBe("tiktok");
    });

    it("detects Reddit", () => {
        expect(detectPlatform("https://reddit.com/u/username")).toBe("reddit");
    });

    it("detects Dev.to", () => {
        expect(detectPlatform("https://dev.to/username")).toBe("devto");
    });

    it("detects Medium", () => {
        expect(detectPlatform("https://medium.com/@username")).toBe("medium");
    });

    it("detects Hashnode", () => {
        expect(detectPlatform("https://hashnode.com/@username")).toBe("hashnode");
    });

    it("detects Dribbble", () => {
        expect(detectPlatform("https://dribbble.com/user")).toBe("dribbble");
    });

    it("detects Kaggle", () => {
        expect(detectPlatform("https://kaggle.com/username")).toBe("kaggle");
    });

    it("detects Behance", () => {
        expect(detectPlatform("https://behance.net/user")).toBe("behance");
    });

    it("falls back to website for unknown URL", () => {
        expect(detectPlatform("https://myblog.io/posts")).toBe("website");
    });

    it("falls back to website for empty-ish URL", () => {
        expect(detectPlatform("https://unknownplatform.xyz")).toBe("website");
    });
});

describe("normalizeUrl", () => {
    it("handles URL with fragment", () => {
        const normalized = normalizeUrl("https://example.com/page#section");
        expect(normalized).toContain("section");
    });

    it("handles URL with query params", () => {
        const normalized = normalizeUrl("example.com?ref=abc");
        expect(normalized).toContain("ref=abc");
    });
});
