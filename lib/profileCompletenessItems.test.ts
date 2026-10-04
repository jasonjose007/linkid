import { computeProfileCompleteness } from "./profileCompleteness";

describe("computeProfileCompleteness — items structure", () => {
    const BASE = {
        image: null, bio: null, seoTitle: null, seoDescription: null,
        resumeUrl: null, isVerified: false, publicLinkCount: 0,
    };

    it("returns exactly 8 checklist items", () => {
        const { items } = computeProfileCompleteness(BASE);
        expect(items).toHaveLength(8);
    });

    it("each item has required keys: key, label, done, weight", () => {
        const { items } = computeProfileCompleteness(BASE);
        for (const item of items) {
            expect(item).toHaveProperty("key");
            expect(item).toHaveProperty("label");
            expect(item).toHaveProperty("done");
            expect(item).toHaveProperty("weight");
        }
    });

    it("all weights are positive numbers", () => {
        const { items } = computeProfileCompleteness(BASE);
        for (const item of items) {
            expect(item.weight).toBeGreaterThan(0);
        }
    });

    it("total weight equals 100", () => {
        const { items } = computeProfileCompleteness(BASE);
        const total = items.reduce((s, i) => s + i.weight, 0);
        expect(total).toBe(100);
    });

    it("known keys include avatar, bio, firstLink, threeLinks, seoTitle, seoDescription, resume, verified", () => {
        const { items } = computeProfileCompleteness(BASE);
        const keys = items.map((i) => i.key);
        expect(keys).toContain("avatar");
        expect(keys).toContain("bio");
        expect(keys).toContain("firstLink");
        expect(keys).toContain("threeLinks");
        expect(keys).toContain("seoTitle");
        expect(keys).toContain("seoDescription");
        expect(keys).toContain("resume");
        expect(keys).toContain("verified");
    });

    it("all items have non-empty labels", () => {
        const { items } = computeProfileCompleteness(BASE);
        for (const item of items) {
            expect(item.label.trim().length).toBeGreaterThan(0);
        }
    });

    it("done items count matches completedCount", () => {
        const full = {
            image: "img.jpg", bio: "bio", seoTitle: "title", seoDescription: "desc",
            resumeUrl: "cv.pdf", isVerified: true, publicLinkCount: 5,
        };
        const result = computeProfileCompleteness(full);
        const doneCount = result.items.filter((i) => i.done).length;
        expect(doneCount).toBe(result.completedCount);
    });
});
