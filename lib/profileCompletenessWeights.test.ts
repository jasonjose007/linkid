import { computeProfileCompleteness } from "./profileCompleteness";

describe("computeProfileCompleteness — weight correctness", () => {
    const BASE = {
        image: null, bio: null, seoTitle: null, seoDescription: null,
        resumeUrl: null, isVerified: false, publicLinkCount: 0,
    };

    it("adding firstLink (weight 20) increases score significantly", () => {
        const without = computeProfileCompleteness(BASE);
        const with_ = computeProfileCompleteness({ ...BASE, publicLinkCount: 1 });
        expect(with_.score).toBeGreaterThan(without.score);
        expect(with_.score - without.score).toBeGreaterThan(15);
    });

    it("adding bio (weight 15) increases score", () => {
        const without = computeProfileCompleteness(BASE);
        const with_ = computeProfileCompleteness({ ...BASE, bio: "My bio" });
        expect(with_.score - without.score).toBeGreaterThan(10);
    });

    it("adding resume (weight 5) increases score by ~5%", () => {
        const without = computeProfileCompleteness(BASE);
        const with_ = computeProfileCompleteness({ ...BASE, resumeUrl: "https://example.com/cv.pdf" });
        expect(with_.score - without.score).toBeGreaterThanOrEqual(4);
        expect(with_.score - without.score).toBeLessThanOrEqual(6);
    });

    it("verifying account (weight 10) increases score", () => {
        const without = computeProfileCompleteness(BASE);
        const with_ = computeProfileCompleteness({ ...BASE, isVerified: true });
        expect(with_.score - without.score).toBeGreaterThan(8);
    });

    it("partial completion returns partial score", () => {
        const partial = computeProfileCompleteness({
            ...BASE,
            image: "https://cdn.example.com/img.jpg",
            bio: "My bio",
        });
        expect(partial.score).toBeGreaterThan(0);
        expect(partial.score).toBeLessThan(100);
        expect(partial.completedCount).toBe(2);
    });

    it("all optional fields including verified = 100%", () => {
        const full = computeProfileCompleteness({
            image: "https://cdn.example.com/img.jpg",
            bio: "Developer",
            seoTitle: "John Doe",
            seoDescription: "Portfolio",
            resumeUrl: "https://example.com/cv.pdf",
            isVerified: true,
            publicLinkCount: 5,
        });
        expect(full.score).toBe(100);
        expect(full.completedCount).toBe(8);
    });
});
