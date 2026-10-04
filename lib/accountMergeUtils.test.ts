import {
    generateMergeCode,
    normalizeMergeCode,
    hashMergeCode,
    buildMergedPlatformSlug,
} from "./accountMergeUtils";

describe("generateMergeCode", () => {
    it("starts with LNK prefix", () => {
        expect(generateMergeCode()).toMatch(/^LNK-/);
    });

    it("matches expected format LNK-XXXXXX-XXXXXX", () => {
        expect(generateMergeCode()).toMatch(/^LNK-[A-F0-9]{6}-[A-F0-9]{6}$/);
    });

    it("generates unique codes each call", () => {
        const a = generateMergeCode();
        const b = generateMergeCode();
        expect(a).not.toBe(b);
    });
});

describe("normalizeMergeCode", () => {
    it("trims whitespace and uppercases", () => {
        expect(normalizeMergeCode("  lnk-aabbcc-ddeeff  ")).toBe("LNK-AABBCC-DDEEFF");
    });

    it("strips non-alphanumeric/hyphen characters", () => {
        expect(normalizeMergeCode("LNK!@#AABBCC-DDEEFF")).toBe("LNKAABBCC-DDEEFF");
    });

    it("preserves valid uppercase code", () => {
        expect(normalizeMergeCode("LNK-AABBCC-DDEEFF")).toBe("LNK-AABBCC-DDEEFF");
    });
});

describe("hashMergeCode", () => {
    it("returns a 64-char hex string (SHA-256)", () => {
        const hash = hashMergeCode("LNK-AABBCC-DDEEFF");
        expect(hash).toHaveLength(64);
        expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it("is deterministic for same input", () => {
        const a = hashMergeCode("LNK-AABBCC-DDEEFF");
        const b = hashMergeCode("LNK-AABBCC-DDEEFF");
        expect(a).toBe(b);
    });

    it("normalizes before hashing — lowercase same as uppercase", () => {
        const upper = hashMergeCode("LNK-AABBCC-DDEEFF");
        const lower = hashMergeCode("lnk-aabbcc-ddeeff");
        expect(upper).toBe(lower);
    });
});

describe("buildMergedPlatformSlug", () => {
    it("builds a slug from platform and source", () => {
        const slug = buildMergedPlatformSlug({
            platform: "github",
            sourceIdentifier: "alice",
            existingPlatforms: new Set(),
        });
        expect(slug).toBe("github-from-alice");
    });

    it("adds numeric suffix when slug already exists", () => {
        const existing = new Set(["github-from-alice"]);
        const slug = buildMergedPlatformSlug({
            platform: "github",
            sourceIdentifier: "alice",
            existingPlatforms: existing,
        });
        expect(slug).toBe("github-from-alice-2");
    });

    it("sanitizes source identifier", () => {
        const slug = buildMergedPlatformSlug({
            platform: "github",
            sourceIdentifier: "Alice Smith!",
            existingPlatforms: new Set(),
        });
        expect(slug).toMatch(/^github-from-alice-smith/);
    });

    it("truncates long source identifiers", () => {
        const slug = buildMergedPlatformSlug({
            platform: "github",
            sourceIdentifier: "a".repeat(50),
            existingPlatforms: new Set(),
        });
        expect(slug.length).toBeLessThan(50);
    });
});
