/**
 * Combined tests for all accountMergeUtils functions together.
 */
import { generateMergeCode, normalizeMergeCode, hashMergeCode, buildMergedPlatformSlug } from "./accountMergeUtils";

describe("accountMergeUtils — combined workflow", () => {
    it("generate → normalize → hash pipeline is deterministic", () => {
        const code = generateMergeCode();
        const normalized = normalizeMergeCode(code);
        const hash1 = hashMergeCode(normalized);
        const hash2 = hashMergeCode(normalized);
        expect(hash1).toBe(hash2);
        expect(hash1).toHaveLength(64);
    });

    it("normalized code hashes same as original generated code", () => {
        const code = generateMergeCode();
        expect(hashMergeCode(code)).toBe(hashMergeCode(normalizeMergeCode(code)));
    });

    it("two different generated codes produce different hashes", () => {
        const code1 = generateMergeCode();
        const code2 = generateMergeCode();
        // With high probability, two 6-char hex segments won't collide
        if (code1 !== code2) {
            expect(hashMergeCode(code1)).not.toBe(hashMergeCode(code2));
        }
    });

    it("buildMergedPlatformSlug with generated source is URL-safe", () => {
        const slug = buildMergedPlatformSlug({
            platform: "github",
            sourceIdentifier: "alice-smith",
            existingPlatforms: new Set(),
        });
        // Slug should only contain lowercase letters, numbers, and hyphens
        expect(slug).toMatch(/^[a-z0-9-]+$/);
    });

    it("different platforms produce different slugs for same source", () => {
        const base = { sourceIdentifier: "alice", existingPlatforms: new Set<string>() };
        const slug1 = buildMergedPlatformSlug({ ...base, platform: "github" });
        const slug2 = buildMergedPlatformSlug({ ...base, platform: "linkedin" });
        expect(slug1).not.toBe(slug2);
    });

    it("slug collision resolution works for 5 consecutive conflicts", () => {
        const existing = new Set([
            "github-from-alice",
            "github-from-alice-2",
            "github-from-alice-3",
            "github-from-alice-4",
            "github-from-alice-5",
        ]);
        const slug = buildMergedPlatformSlug({
            platform: "github",
            sourceIdentifier: "alice",
            existingPlatforms: existing,
        });
        expect(slug).toBe("github-from-alice-6");
        expect(existing.has(slug)).toBe(false);
    });
});
