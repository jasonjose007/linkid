import { POPULAR_PLATFORMS } from "./platformHelpers";

describe("POPULAR_PLATFORMS list", () => {
    it("is a non-empty array", () => {
        expect(Array.isArray(POPULAR_PLATFORMS)).toBe(true);
        expect(POPULAR_PLATFORMS.length).toBeGreaterThan(0);
    });

    it("each entry has value and label properties", () => {
        for (const platform of POPULAR_PLATFORMS) {
            expect(platform).toHaveProperty("value");
            expect(platform).toHaveProperty("label");
            expect(typeof platform.value).toBe("string");
            expect(typeof platform.label).toBe("string");
        }
    });

    it("all values are non-empty strings", () => {
        for (const platform of POPULAR_PLATFORMS) {
            expect(platform.value.trim().length).toBeGreaterThan(0);
        }
    });

    it("all labels are non-empty strings", () => {
        for (const platform of POPULAR_PLATFORMS) {
            expect(platform.label.trim().length).toBeGreaterThan(0);
        }
    });

    it("contains website/other as last entry", () => {
        const last = POPULAR_PLATFORMS[POPULAR_PLATFORMS.length - 1];
        expect(last.value).toBe("website");
    });

    it("does not have duplicate values", () => {
        const values = POPULAR_PLATFORMS.map((p) => p.value);
        expect(new Set(values).size).toBe(values.length);
    });

    it("has at least 10 platforms", () => {
        expect(POPULAR_PLATFORMS.length).toBeGreaterThanOrEqual(10);
    });
});
