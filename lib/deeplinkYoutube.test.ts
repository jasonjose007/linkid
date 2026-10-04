import { getDeepLink } from "./deeplink";

describe("getDeepLink — YouTube comprehensive", () => {
    it("extracts video ID from watch?v= URL for Android", () => {
        const result = getDeepLink("youtube", "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
        expect(result.android).toContain("dQw4w9WgXcQ");
    });

    it("extracts video ID from youtu.be short URL", () => {
        const result = getDeepLink("youtube", "https://youtu.be/dQw4w9WgXcQ");
        expect(result.android).toBe("vnd.youtube://dQw4w9WgXcQ");
    });

    it("handles YouTube Shorts URL", () => {
        const result = getDeepLink("youtube", "https://www.youtube.com/shorts/abc123");
        expect(result.android).toContain("abc123");
    });

    it("falls back to web URL for iOS watch links", () => {
        const result = getDeepLink("youtube", "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
        expect(result.ios).toContain("youtube.com/watch");
    });

    it("handles YouTube channel URL without video", () => {
        const result = getDeepLink("youtube", "https://www.youtube.com/c/mychannel");
        expect(result.android).toContain("vnd.youtube://");
    });

    it("handles @handle channel URL", () => {
        const result = getDeepLink("youtube", "https://www.youtube.com/@channelname");
        expect(result.android).toContain("vnd.youtube://");
    });
});

describe("getDeepLink — Twitter/X", () => {
    it("generates Twitter profile deep link", () => {
        const result = getDeepLink("x", "https://x.com/elonmusk");
        expect(result.android).toContain("twitter://user?screen_name=elonmusk");
    });

    it("generates Twitter status deep link for tweet URL", () => {
        const result = getDeepLink("twitter", "https://twitter.com/user/status/123456789");
        expect(result.android).toContain("twitter://");
    });

    it("falls back for home page", () => {
        const result = getDeepLink("x", "https://x.com/home");
        expect(result.android).toBe("twitter://");
    });
});
