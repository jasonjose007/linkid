import { getMobileOS, getDeepLink } from "./deeplink";

describe("getMobileOS", () => {
    it("detects Android", () => {
        expect(getMobileOS("Mozilla/5.0 (Linux; Android 13; Pixel 6)")).toBe("android");
    });

    it("detects iOS from iPhone", () => {
        expect(getMobileOS("Mozilla/5.0 (iPhone; CPU iPhone OS 16_0)")).toBe("ios");
    });

    it("detects iOS from iPad", () => {
        expect(getMobileOS("Mozilla/5.0 (iPad; CPU OS 16_0)")).toBe("ios");
    });

    it("returns unknown for desktop user agent", () => {
        expect(getMobileOS("Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120")).toBe("unknown");
    });
});

describe("getDeepLink", () => {
    it("returns GitHub deep links for GitHub profile URL", () => {
        const result = getDeepLink("github", "https://github.com/vishnukothakapu");
        expect(result.android).toContain("github://");
        expect(result.ios).toContain("github://");
    });

    it("returns Twitter deep links for Twitter profile URL", () => {
        const result = getDeepLink("twitter", "https://twitter.com/user123");
        expect(result.android).toContain("twitter://");
        expect(result.ios).toContain("twitter://");
    });

    it("returns Instagram deep links for Instagram profile URL", () => {
        const result = getDeepLink("instagram", "https://instagram.com/user123");
        expect(result.android).toContain("instagram://");
    });

    it("returns YouTube deep links for youtu.be short URL", () => {
        const result = getDeepLink("youtube", "https://youtu.be/dQw4w9WgXcQ");
        expect(result.android).toContain("vnd.youtube://dQw4w9WgXcQ");
    });

    it("returns YouTube deep links for watch?v= URL", () => {
        const result = getDeepLink("youtube", "https://www.youtube.com/watch?v=abc123");
        expect(result.android).toContain("abc123");
    });

    it("returns null for unsupported platform", () => {
        const result = getDeepLink("unknown_platform", "https://example.com");
        expect(result.android).toBeNull();
        expect(result.ios).toBeNull();
    });

    it("handles URL without scheme gracefully", () => {
        const result = getDeepLink("github", "github.com/user");
        expect(result.android).toBeTruthy();
    });

    it("returns null on malformed URL", () => {
        const result = getDeepLink("instagram", "not a url !!!");
        expect(result.android).toBeNull();
        expect(result.ios).toBeNull();
    });
});
