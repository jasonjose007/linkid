import { isKnownPlatform } from "./platforms";
import { PLATFORMS } from "./constants";

describe("isKnownPlatform — type guard tests", () => {
    it("returns true for all known platform values", () => {
        for (const value of Object.values(PLATFORMS)) {
            expect(isKnownPlatform(value)).toBe(true);
        }
    });

    it("returns false for empty string", () => {
        expect(isKnownPlatform("")).toBe(false);
    });

    it("returns false for unknown platform string", () => {
        expect(isKnownPlatform("myspace")).toBe(false);
        expect(isKnownPlatform("soundcloud")).toBe(false);
        expect(isKnownPlatform("mastodon")).toBe(false);
    });

    it("returns false for null", () => {
        expect(isKnownPlatform(null as unknown as string)).toBe(false);
    });

    it("returns false for undefined", () => {
        expect(isKnownPlatform(undefined as unknown as string)).toBe(false);
    });

    it("returns false for uppercase version of platform", () => {
        // Platforms are lowercase; uppercase should not match
        expect(isKnownPlatform("GITHUB")).toBe(false);
    });

    it("returns false for number disguised as string", () => {
        expect(isKnownPlatform("123")).toBe(false);
    });

    it("returns true for website (fallback platform)", () => {
        expect(isKnownPlatform("website")).toBe(true);
    });

    it("returns true for x (Twitter new name)", () => {
        expect(isKnownPlatform("x")).toBe(true);
    });
});
