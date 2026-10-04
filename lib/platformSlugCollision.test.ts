import { buildMergedPlatformSlug } from "./accountMergeUtils";

describe("buildMergedPlatformSlug — collision avoidance", () => {
    it("increments suffix until a free slot is found", () => {
        const existing = new Set([
            "github-from-alice",
            "github-from-alice-2",
            "github-from-alice-3",
        ]);
        const slug = buildMergedPlatformSlug({
            platform: "github",
            sourceIdentifier: "alice",
            existingPlatforms: existing,
        });
        expect(slug).toBe("github-from-alice-4");
    });

    it("handles empty sourceIdentifier with fallback 'merged'", () => {
        const slug = buildMergedPlatformSlug({
            platform: "github",
            sourceIdentifier: "",
            existingPlatforms: new Set(),
        });
        expect(slug).toBe("github-from-merged");
    });

    it("handles sourceIdentifier with only special characters", () => {
        const slug = buildMergedPlatformSlug({
            platform: "github",
            sourceIdentifier: "!@#$%",
            existingPlatforms: new Set(),
        });
        expect(slug).toBe("github-from-merged");
    });

    it("lowercases the platform name", () => {
        const slug = buildMergedPlatformSlug({
            platform: "GITHUB",
            sourceIdentifier: "alice",
            existingPlatforms: new Set(),
        });
        expect(slug.startsWith("github-")).toBe(true);
    });

    it("strips leading hyphens from sanitized source", () => {
        const slug = buildMergedPlatformSlug({
            platform: "github",
            sourceIdentifier: "---alice",
            existingPlatforms: new Set(),
        });
        expect(slug).not.toContain("---");
    });

    it("strips trailing hyphens from sanitized source", () => {
        const slug = buildMergedPlatformSlug({
            platform: "github",
            sourceIdentifier: "alice---",
            existingPlatforms: new Set(),
        });
        expect(slug).not.toMatch(/-{2,}/);
    });

    it("collapses consecutive hyphens", () => {
        const slug = buildMergedPlatformSlug({
            platform: "github",
            sourceIdentifier: "alice--bob",
            existingPlatforms: new Set(),
        });
        expect(slug).not.toMatch(/-{2,}/);
    });
});
