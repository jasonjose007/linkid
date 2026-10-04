import { buildTopBreakdown } from "./analyticsMath";

describe("buildTopBreakdown — aggregation and counting", () => {
    it("aggregates multiple rows with the same key", () => {
        const rows = [
            { key: "US", count: 100 },
            { key: "US", count: 50 },
            { key: "US", count: 25 },
        ];
        const result = buildTopBreakdown(rows, "Unknown");
        const usEntry = result.find((r) => r.label === "US");
        expect(usEntry?.count).toBe(175);
    });

    it("returns only 1 entry when all keys are the same", () => {
        const rows = Array.from({ length: 5 }, () => ({ key: "UK", count: 10 }));
        const result = buildTopBreakdown(rows, "Unknown");
        expect(result).toHaveLength(1);
        expect(result[0].count).toBe(50);
    });

    it("entries are sorted by count descending", () => {
        const rows = [
            { key: "C", count: 10 },
            { key: "A", count: 30 },
            { key: "B", count: 20 },
        ];
        const result = buildTopBreakdown(rows, "Unknown");
        expect(result[0].label).toBe("A");
        expect(result[1].label).toBe("B");
        expect(result[2].label).toBe("C");
    });

    it("Other bucket is excluded when 8 or fewer distinct keys", () => {
        const rows = Array.from({ length: 8 }, (_, i) => ({ key: `k${i}`, count: i + 1 }));
        const result = buildTopBreakdown(rows, "Unknown");
        expect(result.find((r) => r.label === "Other")).toBeUndefined();
    });

    it("total count is preserved across aggregation and bucketing", () => {
        const rows = Array.from({ length: 10 }, (_, i) => ({ key: `k${i}`, count: 10 }));
        const result = buildTopBreakdown(rows, "Unknown");
        const totalInResult = result.reduce((s, r) => s + r.count, 0);
        expect(totalInResult).toBe(100);
    });

    it("whitespace-only keys aggregate with null keys", () => {
        const rows = [
            { key: null, count: 5 },
            { key: "   ", count: 3 },
            { key: "US", count: 10 },
        ];
        const result = buildTopBreakdown(rows, "Unknown");
        const unknownEntry = result.find((r) => r.label === "Unknown");
        expect(unknownEntry?.count).toBe(8);
    });
});
