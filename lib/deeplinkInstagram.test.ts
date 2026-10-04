import { getDeepLink } from "./deeplink";

describe("getDeepLink — Instagram comprehensive", () => {
    it("generates profile deep link for username URL", () => {
        const result = getDeepLink("instagram", "https://instagram.com/zuck");
        expect(result.android).toContain("instagram://user?username=zuck");
    });

    it("generates post deep link for /p/ URL", () => {
        const result = getDeepLink("instagram", "https://www.instagram.com/p/ABC123/");
        expect(result.android).toContain("instagram://p/ABC123");
    });

    it("generates reel deep link for /reel/ URL", () => {
        const result = getDeepLink("instagram", "https://www.instagram.com/reel/XYZ789/");
        expect(result.android).toContain("instagram://reel/XYZ789");
    });

    it("handles /reels/ URL", () => {
        const result = getDeepLink("instagram", "https://www.instagram.com/reels/ABC/");
        expect(result.android).toContain("instagram://reel/ABC");
    });

    it("returns same link for both Android and iOS for profile", () => {
        const result = getDeepLink("instagram", "https://instagram.com/user123");
        expect(result.android).toBe(result.ios);
    });

    it("handles URL with www prefix", () => {
        const result = getDeepLink("instagram", "https://www.instagram.com/user123");
        expect(result.android).toContain("instagram://user?username=user123");
    });

    it("handles URL without scheme (prepends https)", () => {
        const result = getDeepLink("instagram", "instagram.com/user123");
        expect(result.android).toContain("instagram://");
    });
});
