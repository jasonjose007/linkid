import { getDeepLink, getMobileOS } from "./deeplink";

describe("getDeepLink — GitHub deep links", () => {
    it("generates github:// scheme for github.com URL", () => {
        const result = getDeepLink("github", "https://github.com/torvalds");
        expect(result.android).toMatch(/^github:\/\//);
        expect(result.ios).toMatch(/^github:\/\//);
    });

    it("preserves path in GitHub deep link", () => {
        const result = getDeepLink("github", "https://github.com/vishnukothakapu/linkid");
        expect(result.android).toContain("vishnukothakapu");
    });

    it("handles GitHub URL without www", () => {
        const result = getDeepLink("github", "https://github.com/user");
        expect(result.android).toContain("github://github.com/user");
    });

    it("handles URL scheme inference for github.com", () => {
        const result = getDeepLink("github", "github.com/user");
        expect(result.android).toContain("github://");
    });
})

describe("getMobileOS — extended edge cases", () => {
    it("detects ANDROID (uppercase) user agent", () => {
        expect(getMobileOS("Mozilla/5.0 (Linux; ANDROID 13; SM-G991B)")).toBe("android");
    });

    it("detects iOS from iPod touch", () => {
        expect(getMobileOS("Mozilla/5.0 (iPod touch; CPU iPhone OS 15_0)")).toBe("ios");
    });

    it("returns unknown for empty user agent", () => {
        expect(getMobileOS("")).toBe("unknown");
    });

    it("returns unknown for bot user agent", () => {
        expect(getMobileOS("Googlebot/2.1")).toBe("unknown");
    });

    it("returns unknown for server-side rendering (Node.js)", () => {
        expect(getMobileOS("node/18.0.0")).toBe("unknown");
    });

    it("Android tablet is still detected as android", () => {
        expect(getMobileOS("Mozilla/5.0 (Linux; Android 12; Galaxy Tab S8)")).toBe("android");
    });
});
