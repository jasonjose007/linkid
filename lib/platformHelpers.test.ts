import { formatLabel } from "./platformHelpers";

describe("formatLabel", () => {
    it("returns 'GitHub' for 'github'", () => {
        expect(formatLabel("github")).toBe("GitHub");
    });

    it("returns 'LinkedIn' for 'linkedin'", () => {
        expect(formatLabel("linkedin")).toBe("LinkedIn");
    });

    it("returns 'X (Twitter)' for 'x'", () => {
        expect(formatLabel("x")).toBe("X (Twitter)");
    });

    it("returns 'YouTube' for 'youtube'", () => {
        expect(formatLabel("youtube")).toBe("YouTube");
    });

    it("returns 'LeetCode' for 'leetcode'", () => {
        expect(formatLabel("leetcode")).toBe("LeetCode");
    });

    it("returns 'Dev.to' for 'devto'", () => {
        expect(formatLabel("devto")).toBe("Dev.to");
    });

    it("capitalizes first letter for unknown platforms", () => {
        expect(formatLabel("twitter")).toBe("Twitter");
        expect(formatLabel("instagram")).toBe("Instagram");
    });

    it("handles empty string by returning empty string", () => {
        expect(formatLabel("")).toBe("");
    });

    it("does not crash on single-character input", () => {
        expect(formatLabel("a")).toBe("A");
    });
});
