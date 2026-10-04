import { computeProfileCompleteness } from "./profileCompleteness";

describe("computeProfileCompleteness — SEO field behavior", () => {
    const BASE = {
        image: null, bio: null, seoTitle: null, seoDescription: null,
        resumeUrl: null, isVerified: false, publicLinkCount: 0,
    };

    it("adding seoTitle increases score by ~10%", () => {
        const without = computeProfileCompleteness(BASE).score;
        const with_ = computeProfileCompleteness({ ...BASE, seoTitle: "My SEO Title" }).score;
        expect(with_ - without).toBeGreaterThanOrEqual(9);
        expect(with_ - without).toBeLessThanOrEqual(11);
    });

    it("adding seoDescription increases score by ~10%", () => {
        const without = computeProfileCompleteness(BASE).score;
        const with_ = computeProfileCompleteness({ ...BASE, seoDescription: "My SEO description" }).score;
        expect(with_ - without).toBeGreaterThanOrEqual(9);
        expect(with_ - without).toBeLessThanOrEqual(11);
    });

    it("whitespace-only seoTitle is treated as not filled", () => {
        const result = computeProfileCompleteness({ ...BASE, seoTitle: "   " });
        const seoItem = result.items.find((i) => i.key === "seoTitle");
        expect(seoItem?.done).toBe(false);
    });

    it("whitespace-only seoDescription is treated as not filled", () => {
        const result = computeProfileCompleteness({ ...BASE, seoDescription: "\t\t" });
        const seoItem = result.items.find((i) => i.key === "seoDescription");
        expect(seoItem?.done).toBe(false);
    });

    it("null seoTitle means seoTitle item is not done", () => {
        const result = computeProfileCompleteness(BASE);
        expect(result.items.find((i) => i.key === "seoTitle")?.done).toBe(false);
    });

    it("both SEO fields filled adds ~20% to score", () => {
        const without = computeProfileCompleteness(BASE).score;
        const with_ = computeProfileCompleteness({
            ...BASE,
            seoTitle: "Title",
            seoDescription: "Description",
        }).score;
        expect(with_ - without).toBeGreaterThanOrEqual(18);
        expect(with_ - without).toBeLessThanOrEqual(22);
    });
});
