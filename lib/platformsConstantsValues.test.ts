import { PLATFORMS } from "./constants";
import { isKnownPlatform } from "./platforms";

describe("PLATFORMS constants — value integrity", () => {
    it("all constant values are reachable via isKnownPlatform", () => {
        for (const value of Object.values(PLATFORMS)) {
            expect(isKnownPlatform(value)).toBe(true);
        }
    });

    it("GITHUB value is 'github'", () => {
        expect(PLATFORMS.GITHUB).toBe("github");
    });

    it("INSTAGRAM value is 'instagram'", () => {
        expect(PLATFORMS.INSTAGRAM).toBe("instagram");
    });

    it("TIKTOK value is 'tiktok'", () => {
        expect(PLATFORMS.TIKTOK).toBe("tiktok");
    });

    it("DISCORD value is 'discord'", () => {
        expect(PLATFORMS.DISCORD).toBe("discord");
    });

    it("REDDIT value is 'reddit'", () => {
        expect(PLATFORMS.REDDIT).toBe("reddit");
    });

    it("DEVTO value is 'devto'", () => {
        expect(PLATFORMS.DEVTO).toBe("devto");
    });

    it("HASHNODE value is 'hashnode'", () => {
        expect(PLATFORMS.HASHNODE).toBe("hashnode");
    });

    it("MEDIUM value is 'medium'", () => {
        expect(PLATFORMS.MEDIUM).toBe("medium");
    });

    it("WEBSITE is the fallback 'website'", () => {
        expect(PLATFORMS.WEBSITE).toBe("website");
    });

    it("no platform value contains uppercase letters", () => {
        for (const value of Object.values(PLATFORMS)) {
            expect(value).toBe(value.toLowerCase());
        }
    });
});
