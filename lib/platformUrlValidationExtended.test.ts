import { validatePlatformUrl } from "./platforms";

describe("validatePlatformUrl — extended platform coverage", () => {
    describe("Dev.to", () => {
        it("accepts dev.to profile", () => {
            expect(validatePlatformUrl("devto", "https://dev.to/username")).toBe(true);
        });
    });

    describe("Medium", () => {
        it("accepts medium.com @handle profile", () => {
            expect(validatePlatformUrl("medium", "https://medium.com/@username")).toBe(true);
        });
    });

    describe("Behance", () => {
        it("accepts behance.net profile", () => {
            expect(validatePlatformUrl("behance", "https://www.behance.net/user")).toBe(true);
        });
    });

    describe("Dribbble", () => {
        it("accepts dribbble.com profile", () => {
            expect(validatePlatformUrl("dribbble", "https://dribbble.com/user")).toBe(true);
        });
    });

    describe("Discord", () => {
        it("accepts discord.gg invite", () => {
            expect(validatePlatformUrl("discord", "https://discord.gg/abcde12345")).toBe(true);
        });
    });

    describe("Substack", () => {
        it("accepts subdomain.substack.com", () => {
            expect(validatePlatformUrl("substack", "https://username.substack.com")).toBe(true);
        });
    });

    describe("TikTok", () => {
        it("accepts tiktok.com/@user", () => {
            expect(validatePlatformUrl("tiktok", "https://www.tiktok.com/@creator123")).toBe(true);
        });
    });

    describe("Reddit", () => {
        it("accepts reddit.com/u/ profile", () => {
            expect(validatePlatformUrl("reddit", "https://www.reddit.com/u/username")).toBe(true);
        });

        it("accepts reddit.com/r/ subreddit", () => {
            expect(validatePlatformUrl("reddit", "https://www.reddit.com/r/programming")).toBe(true);
        });
    });

    describe("Twitch", () => {
        it("accepts twitch.tv channel", () => {
            expect(validatePlatformUrl("twitch", "https://www.twitch.tv/streamer")).toBe(true);
        });
    });

    describe("Snapchat", () => {
        it("accepts snapchat.com/add/ profile", () => {
            expect(validatePlatformUrl("snapchat", "https://www.snapchat.com/add/username")).toBe(true);
        });
    });

    describe("Cross-platform rejection", () => {
        it("GitHub URL rejected for linkedin platform", () => {
            expect(validatePlatformUrl("linkedin", "https://github.com/user")).toBe(false);
        });

        it("Twitter URL rejected for github platform", () => {
            expect(validatePlatformUrl("github", "https://twitter.com/user")).toBe(false);
        });
    });
});
