import { computePercentChange, buildTopBreakdown } from "./analyticsMath";

describe("computePercentChange — numerical precision and edge cases", () => {
    it("handles very large numbers", () => {
        const result = computePercentChange(1_000_000, 500_000);
        expect(result).toBe(100);
    });

    it("handles fractional results", () => {
        const result = computePercentChange(110, 100);
        expect(result).toBe(10);
    });

    it("handles negative current value", () => {
        const result = computePercentChange(-10, 100);
        expect(result).toBe(-110);
    });

    it("handles 0 current with 0 previous → null", () => {
        expect(computePercentChange(0, 0)).toBeNull();
    });

    it("previous=1, current=0 → -100%", () => {
        expect(computePercentChange(0, 1)).toBe(-100);
    });
});

describe("buildTopBreakdown — boundary conditions", () => {
    it("returns exactly 8 entries when exactly 8 distinct keys", () => {
        const rows = Array.from({ length: 8 }, (_, i) => ({ key: `k${i}`, count: i + 1 }));
        const result = buildTopBreakdown(rows, "Unknown");
        expect(result).toHaveLength(8);
        expect(result.find((r) => r.label === "Other")).toBeUndefined();
    });

    it("returns 9 entries (8 + Other) when 9 distinct keys", () => {
        const rows = Array.from({ length: 9 }, (_, i) => ({ key: `k${i}`, count: i + 1 }));
        const result = buildTopBreakdown(rows, "Unknown");
        expect(result).toHaveLength(9);
        expect(result[result.length - 1].label).toBe("Other");
    });

    it("Other entry accumulates all excess counts", () => {
        const rows = [
            ...Array.from({ length: 8 }, (_, i) => ({ key: `top${i}`, count: 100 })),
            { key: "extra1", count: 5 },
            { key: "extra2", count: 3 },
        ];
        const result = buildTopBreakdown(rows, "Unknown");
        const otherEntry = result.find((r) => r.label === "Other");
        expect(otherEntry?.count).toBe(8); // 5 + 3
    });

    it("aggregates null and whitespace into same fallback bucket", () => {
        const rows = [
            { key: null, count: 3 },
            { key: "  ", count: 2 },
            { key: "US", count: 10 },
        ];
        const result = buildTopBreakdown(rows, "Unknown");
        const unknownEntry = result.find((r) => r.label === "Unknown");
        expect(unknownEntry?.count).toBe(5);
    });

    it("sorts entries with equal counts stably", () => {
        const rows = [
            { key: "B", count: 10 },
            { key: "A", count: 10 },
        ];
        const result = buildTopBreakdown(rows, "Unknown");
        expect(result).toHaveLength(2);
        expect(result.every((r) => r.count === 10)).toBe(true);
    });
});
