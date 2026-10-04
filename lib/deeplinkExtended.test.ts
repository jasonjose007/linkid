import { getDeepLink, getMobileOS } from "./deeplink";

describe("getDeepLink — extended platform coverage", () => {
    describe("Discord", () => {
        it("returns invite deep link for discord.gg URL", () => {
            const result = getDeepLink("discord", "https://discord.gg/abc123");
            expect(result.android).toContain("invite/abc123");
            expect(result.ios).toContain("invite/abc123");
        });

        it("returns deep link for discord.com URL", () => {
            const result = getDeepLink("discord", "https://discord.com/channels/123");
            expect(result.android).toContain("discord://");
        });
    });

    describe("TikTok", () => {
        it("returns deep link for TikTok user URL", () => {
            const result = getDeepLink("tiktok", "https://tiktok.com/@user123");
            expect(result.android).toContain("user123");
        });

        it("returns null for short TikTok URL (vm.tiktok.com)", () => {
            const result = getDeepLink("tiktok", "https://vm.tiktok.com/abc");
            expect(result.android).toBeNull();
        });
    });

    describe("Facebook", () => {
        it("returns Facebook web modal scheme", () => {
            const result = getDeepLink("facebook", "https://facebook.com/pagename");
            expect(result.android).toContain("fb://");
        });
    });

    describe("Twitch", () => {
        it("returns Twitch stream deep link", () => {
            const result = getDeepLink("twitch", "https://twitch.tv/streamer123");
            expect(result.android).toContain("twitch://stream/streamer123");
        });

        it("returns null when no channel in URL", () => {
            const result = getDeepLink("twitch", "https://twitch.tv/");
            expect(result.android).toBeNull();
        });
    });

    describe("LinkedIn", () => {
        it("returns LinkedIn intent URI for Android", () => {
            const result = getDeepLink("linkedin", "https://linkedin.com/in/user");
            expect(result.android).toContain("intent://");
        });

        it("returns web URL for iOS", () => {
            const result = getDeepLink("linkedin", "https://linkedin.com/in/user");
            expect(result.ios).toContain("https://");
        });
    });
});

describe("getMobileOS — extended cases", () => {
    it("detects iPod touch as iOS", () => {
        expect(getMobileOS("Mozilla/5.0 (iPod touch; CPU iPhone OS 15_0)")).toBe("ios");
    });

    it("detects Android tablet as android", () => {
        expect(getMobileOS("Mozilla/5.0 (Linux; Android 12; Galaxy Tab S8)")).toBe("android");
    });

    it("returns unknown for empty string", () => {
        expect(getMobileOS("")).toBe("unknown");
    });
});
