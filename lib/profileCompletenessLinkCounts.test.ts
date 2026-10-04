import { computeProfileCompleteness } from "./profileCompleteness";

describe("computeProfileCompleteness — link count thresholds", () => {
    const BASE = {
        image: null, bio: null, seoTitle: null, seoDescription: null,
        resumeUrl: null, isVerified: false,
    };

    it("0 links: neither firstLink nor threeLinks done", () => {
        const result = computeProfileCompleteness({ ...BASE, publicLinkCount: 0 });
        expect(result.items.find((i) => i.key === "firstLink")?.done).toBe(false);
        expect(result.items.find((i) => i.key === "threeLinks")?.done).toBe(false);
    });

    it("1 link: firstLink done, threeLinks not done", () => {
        const result = computeProfileCompleteness({ ...BASE, publicLinkCount: 1 });
        expect(result.items.find((i) => i.key === "firstLink")?.done).toBe(true);
        expect(result.items.find((i) => i.key === "threeLinks")?.done).toBe(false);
    });

    it("2 links: firstLink done, threeLinks not done", () => {
        const result = computeProfileCompleteness({ ...BASE, publicLinkCount: 2 });
        expect(result.items.find((i) => i.key === "firstLink")?.done).toBe(true);
        expect(result.items.find((i) => i.key === "threeLinks")?.done).toBe(false);
    });

    it("3 links: both firstLink and threeLinks done", () => {
        const result = computeProfileCompleteness({ ...BASE, publicLinkCount: 3 });
        expect(result.items.find((i) => i.key === "firstLink")?.done).toBe(true);
        expect(result.items.find((i) => i.key === "threeLinks")?.done).toBe(true);
    });

    it("10 links: both done", () => {
        const result = computeProfileCompleteness({ ...BASE, publicLinkCount: 10 });
        expect(result.items.find((i) => i.key === "firstLink")?.done).toBe(true);
        expect(result.items.find((i) => i.key === "threeLinks")?.done).toBe(true);
    });

    it("score jumps when crossing threshold from 2 to 3 links", () => {
        const score2 = computeProfileCompleteness({ ...BASE, publicLinkCount: 2 }).score;
        const score3 = computeProfileCompleteness({ ...BASE, publicLinkCount: 3 }).score;
        expect(score3).toBeGreaterThan(score2);
    });
});
