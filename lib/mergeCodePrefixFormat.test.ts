import { generateMergeCode, normalizeMergeCode } from "./accountMergeUtils";

describe("generateMergeCode — format specification", () => {
    it("code has exactly 3 parts separated by hyphens", () => {
        const code = generateMergeCode();
        const parts = code.split("-");
        expect(parts).toHaveLength(3);
    });

    it("first part is always LNK (prefix)", () => {
        for (let i = 0; i < 5; i++) {
            expect(generateMergeCode().split("-")[0]).toBe("LNK");
        }
    });

    it("second part is exactly 6 hex chars (uppercase A-F, 0-9)", () => {
        const code = generateMergeCode();
        const part = code.split("-")[1];
        expect(part).toHaveLength(6);
        expect(part).toMatch(/^[A-F0-9]{6}$/);
    });

    it("third part is exactly 6 hex chars", () => {
        const code = generateMergeCode();
        const part = code.split("-")[2];
        expect(part).toHaveLength(6);
        expect(part).toMatch(/^[A-F0-9]{6}$/);
    });

    it("full code matches LNK-XXXXXX-XXXXXX pattern", () => {
        expect(generateMergeCode()).toMatch(/^LNK-[A-F0-9]{6}-[A-F0-9]{6}$/);
    });
});

describe("normalizeMergeCode — idempotency", () => {
    it("normalizing an already-normalized code is idempotent", () => {
        const code = "LNK-AABBCC-DDEEFF";
        expect(normalizeMergeCode(normalizeMergeCode(code))).toBe(normalizeMergeCode(code));
    });

    it("normalizing a generated code is idempotent", () => {
        const code = generateMergeCode();
        expect(normalizeMergeCode(normalizeMergeCode(code))).toBe(normalizeMergeCode(code));
    });
});
