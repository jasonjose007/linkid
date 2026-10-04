import { buildTopBreakdown } from "./analyticsMath";

describe("buildTopBreakdown — top entries accuracy", () => {
    it("returns entries in descending count order", () => {
        const rows = [
            { key: "US", count: 100 },
            { key: "UK", count: 300 },
            { key: "CA", count: 200 },
        ];
        const result = buildTopBreakdown(rows, "Unknown");
        expect(result[0].label).toBe("UK");
        expect(result[1].label).toBe("CA");
        expect(result[2].label).toBe("US");
    });

    it("preserves all entries when fewer than 8", () => {
        const rows = [
            { key: "A", count: 10 },
            { key: "B", count: 20 },
            { key: "C", count: 30 },
        ];
        expect(buildTopBreakdown(rows, "Unknown")).toHaveLength(3);
    });

    it("limits to 8 distinct labels + Other", () => {
        const rows = Array.from({ length: 12 }, (_, i) => ({ key: `k${i}`, count: 12 - i }));
        const result = buildTopBreakdown(rows, "Unknown");
        expect(result).toHaveLength(9); // 8 + Other
    });

    it("all top 8 have higher count than Other-bucketed entries", () => {
        const rows = [
            ...Array.from({ length: 8 }, (_, i) => ({ key: `top${i}`, count: 100 - i })),
            { key: "extra1", count: 5 },
            { key: "extra2", count: 3 },
        ];
        const result = buildTopBreakdown(rows, "Unknown");
        const otherEntry = result.find((r) => r.label === "Other");
        const topEntries = result.filter((r) => r.label !== "Other");
        const minTopCount = Math.min(...topEntries.map((r) => r.count));
        expect(otherEntry?.count).toBeLessThan(minTopCount);
    });

    it("single entry returns just that entry", () => {
        const result = buildTopBreakdown([{ key: "US", count: 50 }], "Unknown");
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({ label: "US", count: 50 });
    });
});
