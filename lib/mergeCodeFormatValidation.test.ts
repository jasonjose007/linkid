import { normalizeMergeCode, hashMergeCode, generateMergeCode } from "./accountMergeUtils";

describe("Merge code format validation", () => {
    describe("normalizeMergeCode — comprehensive", () => {
        it("handles code with mixed case", () => {
            expect(normalizeMergeCode("lnk-aabbcc-ddeeff")).toBe("LNK-AABBCC-DDEEFF");
        });

        it("removes dots from code", () => {
            expect(normalizeMergeCode("LNK.AABBCC.DDEEFF")).toBe("LNKAABBCCDDEEFF");
        });

        it("removes forward slashes", () => {
            expect(normalizeMergeCode("LNK/AABBCC/DDEEFF")).toBe("LNKAABBCCDDEEFF");
        });

        it("handles leading/trailing whitespace with mixed case", () => {
            expect(normalizeMergeCode("  lnk-aabbcc-ddeeff  ")).toBe("LNK-AABBCC-DDEEFF");
        });

        it("returns empty string when given only special chars", () => {
            expect(normalizeMergeCode("!@#$%")).toBe("");
        });
    });

    describe("hashMergeCode — collision resistance", () => {
        it("different codes have different hashes", () => {
            const h1 = hashMergeCode("LNK-AABBCC-DDEEFF");
            const h2 = hashMergeCode("LNK-112233-445566");
            expect(h1).not.toBe(h2);
        });

        it("code with extra whitespace hashes same as trimmed code", () => {
            const h1 = hashMergeCode("  LNK-AABBCC-DDEEFF  ");
            const h2 = hashMergeCode("LNK-AABBCC-DDEEFF");
            expect(h1).toBe(h2);
        });

        it("always produces 64 hex characters", () => {
            for (let i = 0; i < 5; i++) {
                const code = generateMergeCode();
                expect(hashMergeCode(code)).toHaveLength(64);
            }
        });
    });

    describe("generateMergeCode — entropy checks", () => {
        it("generates 10 unique codes without collision", () => {
            const codes = new Set(Array.from({ length: 10 }, () => generateMergeCode()));
            expect(codes.size).toBe(10);
        });

        it("each code has exactly 2 hyphens", () => {
            for (let i = 0; i < 5; i++) {
                const code = generateMergeCode();
                const hyphenCount = (code.match(/-/g) || []).length;
                expect(hyphenCount).toBe(2);
            }
        });
    });
});
