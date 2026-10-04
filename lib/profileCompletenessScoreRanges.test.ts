import { computeProfileCompleteness } from "./profileCompleteness";

describe("computeProfileCompleteness — score range validation", () => {
    const BASE = {
        image: null, bio: null, seoTitle: null, seoDescription: null,
        resumeUrl: null, isVerified: false, publicLinkCount: 0,
    };

    it("score is always between 0 and 100", () => {
        for (let i = 0; i <= 5; i++) {
            const result = computeProfileCompleteness({ ...BASE, publicLinkCount: i });
            expect(result.score).toBeGreaterThanOrEqual(0);
            expect(result.score).toBeLessThanOrEqual(100);
        }
    });

    it("score increases monotonically as fields are added", () => {
        const scores: number[] = [];
        scores.push(computeProfileCompleteness(BASE).score);
        scores.push(computeProfileCompleteness({ ...BASE, bio: "bio" }).score);
        scores.push(computeProfileCompleteness({ ...BASE, bio: "bio", image: "img.jpg" }).score);
        scores.push(computeProfileCompleteness({ ...BASE, bio: "bio", image: "img.jpg", isVerified: true }).score);

        for (let i = 1; i < scores.length; i++) {
            expect(scores[i]).toBeGreaterThanOrEqual(scores[i - 1]);
        }
    });

    it("completedCount is always between 0 and totalCount", () => {
        const result = computeProfileCompleteness(BASE);
        expect(result.completedCount).toBeGreaterThanOrEqual(0);
        expect(result.completedCount).toBeLessThanOrEqual(result.totalCount);
    });

    it("score is exactly 100 when all items are done", () => {
        const fullProfile = {
            image: "https://cdn.example.com/img.jpg",
            bio: "Full bio",
            seoTitle: "Title",
            seoDescription: "Description",
            resumeUrl: "https://example.com/cv.pdf",
            isVerified: true,
            publicLinkCount: 5,
        };
        expect(computeProfileCompleteness(fullProfile).score).toBe(100);
    });

    it("score is exactly 0 when nothing is filled", () => {
        expect(computeProfileCompleteness(BASE).score).toBe(0);
    });
});
