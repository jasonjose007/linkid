import { computePercentChange } from "./analyticsMath";

describe("computePercentChange — calculation precision", () => {
    it("50% increase from 100 to 150", () => {
        expect(computePercentChange(150, 100)).toBe(50);
    });

    it("100% increase (doubles)", () => {
        expect(computePercentChange(200, 100)).toBe(100);
    });

    it("50% decrease from 100 to 50", () => {
        expect(computePercentChange(50, 100)).toBe(-50);
    });

    it("100% decrease (to zero)", () => {
        expect(computePercentChange(0, 100)).toBe(-100);
    });

    it("0% change (no difference)", () => {
        expect(computePercentChange(100, 100)).toBe(0);
    });

    it("new (previous = 0, current > 0)", () => {
        expect(computePercentChange(1, 0)).toBe("new");
        expect(computePercentChange(1000, 0)).toBe("new");
    });

    it("null when both are zero", () => {
        expect(computePercentChange(0, 0)).toBeNull();
    });

    it("200% increase (triples)", () => {
        expect(computePercentChange(300, 100)).toBe(200);
    });

    it("fractional percent change preserved", () => {
        const change = computePercentChange(110, 100);
        expect(change).toBe(10);
    });

    it("large numbers work correctly", () => {
        expect(computePercentChange(2_000_000, 1_000_000)).toBe(100);
    });

    it("negative previous value (rare edge case)", () => {
        const change = computePercentChange(-50, -100);
        // (-50 - (-100)) / (-100) * 100 = -50%
        expect(typeof change).toBe("number");
    });
});
