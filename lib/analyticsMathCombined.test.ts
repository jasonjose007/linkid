import { computePercentChange, buildTopBreakdown } from "./analyticsMath";

describe("analyticsMath — combined workflow scenarios", () => {
    describe("computePercentChange for dashboard metrics", () => {
        it("calculates monthly revenue growth", () => {
            const currentRevenue = 15_000;
            const previousRevenue = 12_000;
            const change = computePercentChange(currentRevenue, previousRevenue);
            expect(change).toBeCloseTo(25, 0);
        });

        it("handles seasonal drop correctly", () => {
            const jan = 5_000;
            const dec = 12_000;
            const change = computePercentChange(jan, dec);
            expect(change).toBeLessThan(0);
        });

        it("first month of tracking → new", () => {
            expect(computePercentChange(500, 0)).toBe("new");
        });

        it("no change across weeks → 0%", () => {
            expect(computePercentChange(1000, 1000)).toBe(0);
        });
    });

    describe("buildTopBreakdown for referrer analytics", () => {
        const referrers = [
            { key: "google.com", count: 450 },
            { key: "twitter.com", count: 120 },
            { key: "direct", count: 300 },
            { key: "linkedin.com", count: 85 },
            { key: "github.com", count: 60 },
            { key: "facebook.com", count: 45 },
            { key: "reddit.com", count: 30 },
            { key: "hn.algolia.com", count: 20 },
            { key: "producthunt.com", count: 15 },
            { key: "medium.com", count: 10 },
        ];

        it("top 8 referrers without Other when exactly 8 unique", () => {
            const top8 = referrers.slice(0, 8);
            const result = buildTopBreakdown(top8, "Direct");
            expect(result.some((r) => r.label === "Other")).toBe(false);
        });

        it("adds Other bucket when 10 referrers", () => {
            const result = buildTopBreakdown(referrers, "Direct");
            expect(result.some((r) => r.label === "Other")).toBe(true);
        });

        it("google.com is first (most visits)", () => {
            const result = buildTopBreakdown(referrers, "Direct");
            expect(result[0].label).toBe("google.com");
        });

        it("Other bucket has remaining referrer counts", () => {
            const result = buildTopBreakdown(referrers, "Direct");
            const other = result.find((r) => r.label === "Other");
            expect(other?.count).toBe(15 + 10); // producthunt + medium
        });
    });
});
