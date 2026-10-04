import { PLATFORMS, type PlatformKey, type PlatformValue } from "./constants";

describe("PLATFORMS constants", () => {
    it("GITHUB equals 'github'", () => {
        expect(PLATFORMS.GITHUB).toBe("github");
    });

    it("LINKEDIN equals 'linkedin'", () => {
        expect(PLATFORMS.LINKEDIN).toBe("linkedin");
    });

    it("YOUTUBE equals 'youtube'", () => {
        expect(PLATFORMS.YOUTUBE).toBe("youtube");
    });

    it("TWITTER equals 'twitter'", () => {
        expect(PLATFORMS.TWITTER).toBe("twitter");
    });

    it("X equals 'x'", () => {
        expect(PLATFORMS.X).toBe("x");
    });

    it("WEBSITE equals 'website'", () => {
        expect(PLATFORMS.WEBSITE).toBe("website");
    });

    it("DISCORD equals 'discord'", () => {
        expect(PLATFORMS.DISCORD).toBe("discord");
    });

    it("all platform values are lowercase strings", () => {
        const values = Object.values(PLATFORMS) as string[];
        values.forEach((v) => {
            expect(v).toBe(v.toLowerCase());
            expect(typeof v).toBe("string");
        });
    });

    it("has no duplicate values", () => {
        const values = Object.values(PLATFORMS);
        const unique = new Set(values);
        expect(unique.size).toBe(values.length);
    });

    it("contains at least 15 platform entries", () => {
        expect(Object.keys(PLATFORMS).length).toBeGreaterThanOrEqual(15);
    });
});
