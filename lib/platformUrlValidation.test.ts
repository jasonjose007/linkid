import { validatePlatformUrl } from "./platforms";

describe("validatePlatformUrl", () => {
    describe("GitHub", () => {
        it("accepts a valid GitHub profile URL", () => {
            expect(validatePlatformUrl("github", "https://github.com/torvalds")).toBe(true);
        });

        it("rejects a GitHub URL with subdirectory path", () => {
            expect(validatePlatformUrl("github", "https://github.com/torvalds/linux")).toBe(false);
        });

        it("rejects a non-GitHub URL for github platform", () => {
            expect(validatePlatformUrl("github", "https://gitlab.com/user")).toBe(false);
        });
    });

    describe("LinkedIn", () => {
        it("accepts a valid LinkedIn profile URL", () => {
            expect(validatePlatformUrl("linkedin", "https://linkedin.com/in/satyanadella")).toBe(true);
        });

        it("rejects LinkedIn messaging URL", () => {
            expect(validatePlatformUrl("linkedin", "https://linkedin.com/messaging")).toBe(false);
        });

        it("rejects LinkedIn feed URL", () => {
            expect(validatePlatformUrl("linkedin", "https://linkedin.com/feed")).toBe(false);
        });
    });

    describe("YouTube", () => {
        it("accepts a YouTube channel URL", () => {
            expect(validatePlatformUrl("youtube", "https://youtube.com/c/mychannel")).toBe(true);
        });

        it("accepts a YouTube @handle URL", () => {
            expect(validatePlatformUrl("youtube", "https://youtube.com/@mybrand")).toBe(true);
        });
    });

    describe("Twitter/X", () => {
        it("accepts a Twitter profile URL", () => {
            expect(validatePlatformUrl("x", "https://x.com/elonmusk")).toBe(true);
        });

        it("accepts an old twitter.com URL", () => {
            expect(validatePlatformUrl("x", "https://twitter.com/elonmusk")).toBe(true);
        });
    });

    describe("Instagram", () => {
        it("accepts a valid Instagram profile", () => {
            expect(validatePlatformUrl("instagram", "https://instagram.com/username")).toBe(true);
        });
    });

    describe("StackOverflow", () => {
        it("accepts a valid SO profile URL", () => {
            expect(validatePlatformUrl("stackoverflow", "https://stackoverflow.com/users/123456/username")).toBe(true);
        });
    });
});
