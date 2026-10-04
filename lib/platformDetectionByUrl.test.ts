import { detectPlatform } from "./platforms";

describe("detectPlatform — URL pattern detection", () => {
    describe("Social media platforms", () => {
        it("detects facebook.com", () => {
            expect(detectPlatform("https://www.facebook.com/username")).toBe("facebook");
        });

        it("detects snapchat.com", () => {
            expect(detectPlatform("https://www.snapchat.com/add/username")).toBe("snapchat");
        });

        it("detects discord.gg invite", () => {
            expect(detectPlatform("https://discord.gg/invite123")).toBe("discord");
        });

        it("detects twitch.tv channel", () => {
            expect(detectPlatform("https://www.twitch.tv/streamer")).toBe("twitch");
        });
    });

    describe("Professional networks", () => {
        it("detects Substack newsletter", () => {
            expect(detectPlatform("https://username.substack.com")).toBe("substack");
        });

        it("detects Dribbble portfolio", () => {
            expect(detectPlatform("https://dribbble.com/user")).toBe("dribbble");
        });
    });

    describe("Website fallback", () => {
        it("falls back for personal domain", () => {
            expect(detectPlatform("https://johndoe.com")).toBe("website");
        });

        it("falls back for custom TLD (.io)", () => {
            expect(detectPlatform("https://myapp.io")).toBe("website");
        });

        it("falls back for news site", () => {
            expect(detectPlatform("https://techcrunch.com")).toBe("website");
        });

        it("falls back for unknown social platform", () => {
            expect(detectPlatform("https://mastodon.social/@user")).toBe("website");
        });
    });

    describe("URL normalization in detection", () => {
        it("detects github without https:// prefix", () => {
            expect(detectPlatform("github.com/user")).toBe("github");
        });

        it("detects linkedin with trailing slash", () => {
            expect(detectPlatform("https://linkedin.com/in/user/")).toBe("linkedin");
        });
    });
});
