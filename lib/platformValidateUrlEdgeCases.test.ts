import { validatePlatformUrl } from "./platforms";

describe("validatePlatformUrl — edge cases", () => {
    it("rejects empty string for any platform", () => {
        expect(validatePlatformUrl("github", "")).toBe(false);
    });

    it("rejects whitespace-only URL", () => {
        expect(validatePlatformUrl("github", "   ")).toBe(false);
    });

    it("rejects URL without domain TLD", () => {
        expect(validatePlatformUrl("github", "https://github")).toBe(false);
    });

    it("rejects URL with wrong domain for platform", () => {
        expect(validatePlatformUrl("github", "https://notgithub.com/user")).toBe(false);
    });

    it("accepts URL with query parameters", () => {
        expect(validatePlatformUrl("github", "https://github.com/user?tab=repositories")).toBe(true);
    });

    it("rejects LinkedIn /messaging path (safety check)", () => {
        expect(validatePlatformUrl("linkedin", "https://linkedin.com/messaging")).toBe(false);
    });

    it("rejects LinkedIn /feed path (internal navigation)", () => {
        expect(validatePlatformUrl("linkedin", "https://linkedin.com/feed")).toBe(false);
    });

    it("accepts YouTube shorts URL", () => {
        expect(validatePlatformUrl("youtube", "https://youtube.com/shorts/videoId")).toBe(true);
    });

    it("accepts YouTube channel URL with @", () => {
        expect(validatePlatformUrl("youtube", "https://youtube.com/@channelhandle")).toBe(true);
    });

    it("accepts Twitter URL with X domain (twitter.com)", () => {
        expect(validatePlatformUrl("x", "https://twitter.com/user")).toBe(true);
    });
});
