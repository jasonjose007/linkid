import { computePercentChange, buildTopBreakdown } from "./analyticsMath";

describe("computePercentChange", () => {
    it("returns percent increase correctly", () => {
        expect(computePercentChange(150, 100)).toBe(50);
    });

    it("returns percent decrease correctly", () => {
        expect(computePercentChange(50, 100)).toBe(-50);
    });

    it("returns null when both are zero", () => {
        expect(computePercentChange(0, 0)).toBeNull();
    });

    it("returns 'new' when previous is zero but current is positive", () => {
        expect(computePercentChange(10, 0)).toBe("new");
    });

    it("returns 0 when current equals previous", () => {
        expect(computePercentChange(100, 100)).toBe(0);
    });
});

describe("buildTopBreakdown", () => {
    it("returns top entries sorted by count descending", () => {
        const rows = [
            { key: "US", count: 10 },
            { key: "UK", count: 30 },
            { key: "IN", count: 20 },
        ];
        const result = buildTopBreakdown(rows, "Unknown");
        expect(result[0].label).toBe("UK");
        expect(result[0].count).toBe(30);
    });

    it("replaces null keys with fallback label", () => {
        const rows = [{ key: null, count: 5 }];
        const result = buildTopBreakdown(rows, "Unknown");
        expect(result[0].label).toBe("Unknown");
    });

    it("replaces empty string keys with fallback label", () => {
        const rows = [{ key: "  ", count: 3 }];
        const result = buildTopBreakdown(rows, "Unknown");
        expect(result[0].label).toBe("Unknown");
    });

    it("aggregates duplicate keys", () => {
        const rows = [
            { key: "US", count: 10 },
            { key: "US", count: 5 },
        ];
        const result = buildTopBreakdown(rows, "Unknown");
        expect(result[0].count).toBe(15);
    });

    it("adds an Other entry when more than 8 distinct keys", () => {
        const rows = Array.from({ length: 10 }, (_, i) => ({ key: `k${i}`, count: 10 - i }));
        const result = buildTopBreakdown(rows, "Unknown");
        expect(result[result.length - 1].label).toBe("Other");
    });

    it("returns empty array for empty input", () => {
        expect(buildTopBreakdown([], "Unknown")).toEqual([]);
    });
});
