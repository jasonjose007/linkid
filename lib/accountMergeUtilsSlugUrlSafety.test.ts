import { buildMergedPlatformSlug } from "./accountMergeUtils";

describe("buildMergedPlatformSlug — URL safety invariants", () => {
    const SAFE_SLUG_RE = /^[a-z0-9-]+$/;

    it("result is URL-safe (lowercase alphanumeric + hyphens only)", () => {
        const slug = buildMergedPlatformSlug({
            platform: "github",
            sourceIdentifier: "user-123",
            existingPlatforms: new Set(),
        });
        expect(SAFE_SLUG_RE.test(slug)).toBe(true);
    });

    it("source with uppercase is slugified to lowercase", () => {
        const slug = buildMergedPlatformSlug({
            platform: "github",
            sourceIdentifier: "MyUser",
            existingPlatforms: new Set(),
        });
        expect(slug).toBe(slug.toLowerCase());
    });

    it("source with spaces produces hyphenated slug", () => {
        const slug = buildMergedPlatformSlug({
            platform: "linkedin",
            sourceIdentifier: "john smith",
            existingPlatforms: new Set(),
        });
        expect(slug).toMatch(/^linkedin-from-[a-z-]+$/);
        expect(slug).not.toContain(" ");
    });

    it("slug never starts with a hyphen", () => {
        const slug = buildMergedPlatformSlug({
            platform: "github",
            sourceIdentifier: "---user",
            existingPlatforms: new Set(),
        });
        expect(slug.startsWith("-")).toBe(false);
    });

    it("slug never ends with a hyphen (from trailing hyphens in source)", () => {
        const slug = buildMergedPlatformSlug({
            platform: "twitter",
            sourceIdentifier: "user---",
            existingPlatforms: new Set(),
        });
        expect(slug.endsWith("-")).toBe(false);
    });

    it("all generated slugs for different platforms are URL-safe", () => {
        const platforms = ["github", "linkedin", "twitter", "youtube", "instagram"];
        for (const platform of platforms) {
            const slug = buildMergedPlatformSlug({
                platform,
                sourceIdentifier: "test-user-123",
                existingPlatforms: new Set(),
            });
            expect(SAFE_SLUG_RE.test(slug)).toBe(true);
        }
    });
});
