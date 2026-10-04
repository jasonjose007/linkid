import { buildMergedPlatformSlug } from "./accountMergeUtils";

describe("buildMergedPlatformSlug — source identifier truncation", () => {
    it("truncates source identifier at 20 characters", () => {
        const slug = buildMergedPlatformSlug({
            platform: "github",
            sourceIdentifier: "verylongidentifierthatexceeds20chars",
            existingPlatforms: new Set(),
        });
        // Source should be truncated to 20 chars before adding platform prefix
        const sourcePart = slug.replace("github-from-", "");
        expect(sourcePart.length).toBeLessThanOrEqual(20);
    });

    it("exactly 20-char source preserved fully", () => {
        const source = "a".repeat(20);
        const slug = buildMergedPlatformSlug({
            platform: "github",
            sourceIdentifier: source,
            existingPlatforms: new Set(),
        });
        expect(slug).toBe(`github-from-${source}`);
    });

    it("replaces special chars with hyphens", () => {
        const slug = buildMergedPlatformSlug({
            platform: "linkedin",
            sourceIdentifier: "John Smith (Dev)",
            existingPlatforms: new Set(),
        });
        expect(slug).toMatch(/^linkedin-from-john-smith-dev/);
    });

    it("handles unicode characters by removing them", () => {
        const slug = buildMergedPlatformSlug({
            platform: "github",
            sourceIdentifier: "José García",
            existingPlatforms: new Set(),
        });
        expect(slug).toContain("github-from-");
        expect(slug).not.toContain("é");
    });

    it("builds correct slug for linkedin platform", () => {
        const slug = buildMergedPlatformSlug({
            platform: "linkedin",
            sourceIdentifier: "johndoe",
            existingPlatforms: new Set(),
        });
        expect(slug).toBe("linkedin-from-johndoe");
    });

    it("builds correct slug for twitter platform", () => {
        const slug = buildMergedPlatformSlug({
            platform: "twitter",
            sourceIdentifier: "jack",
            existingPlatforms: new Set(),
        });
        expect(slug).toBe("twitter-from-jack");
    });
});
