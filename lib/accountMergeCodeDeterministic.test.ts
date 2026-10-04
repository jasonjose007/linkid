import { hashMergeCode, normalizeMergeCode } from "./accountMergeUtils";

describe("hashMergeCode — determinism and non-reversibility", () => {
    it("same code always produces same hash (stable)", () => {
        const code = "LNK-ABCDEF-123456";
        expect(hashMergeCode(code)).toBe(hashMergeCode(code));
    });

    it("different codes produce different hashes (collision resistance)", () => {
        const h1 = hashMergeCode("LNK-AAAAAA-BBBBBB");
        const h2 = hashMergeCode("LNK-CCCCCC-DDDDDD");
        expect(h1).not.toBe(h2);
    });

    it("hash is always 64 hex chars (SHA-256 output)", () => {
        expect(hashMergeCode("LNK-123456-789ABC")).toHaveLength(64);
    });

    it("hash is lowercase hex", () => {
        expect(hashMergeCode("LNK-ABC123-DEF456")).toMatch(/^[0-9a-f]{64}$/);
    });

    it("normalized version hashes the same as original", () => {
        const code = "LNK-ABCDEF-123456";
        expect(hashMergeCode(code)).toBe(hashMergeCode(normalizeMergeCode(code)));
    });

    it("case-insensitive normalization: upper and lower case same hash", () => {
        expect(hashMergeCode("LNK-ABCDEF-123456")).toBe(hashMergeCode("lnk-abcdef-123456"));
    });

    it("single character difference produces completely different hash (avalanche)", () => {
        const h1 = hashMergeCode("LNK-AAAAAA-000001");
        const h2 = hashMergeCode("LNK-AAAAAA-000002");
        expect(h1).not.toBe(h2);
        // Verify at least 10 chars differ (avalanche effect)
        const diffCount = h1.split("").filter((c, i) => c !== h2[i]).length;
        expect(diffCount).toBeGreaterThan(10);
    });
});
