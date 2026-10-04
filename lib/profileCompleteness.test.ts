import { computeProfileCompleteness } from "./profileCompleteness";

const EMPTY_INPUT = {
    image: null,
    bio: null,
    seoTitle: null,
    seoDescription: null,
    resumeUrl: null,
    isVerified: false,
    publicLinkCount: 0,
};

const FULL_INPUT = {
    image: "https://cdn.example.com/avatar.jpg",
    bio: "Software engineer building cool things",
    seoTitle: "John Doe – Developer",
    seoDescription: "Portfolio and links for John Doe",
    resumeUrl: "https://example.com/resume.pdf",
    isVerified: true,
    publicLinkCount: 5,
};

describe("computeProfileCompleteness", () => {
    it("returns score 0 for an empty profile", () => {
        const result = computeProfileCompleteness(EMPTY_INPUT);
        expect(result.score).toBe(0);
    });

    it("returns score 100 for a fully complete profile", () => {
        const result = computeProfileCompleteness(FULL_INPUT);
        expect(result.score).toBe(100);
    });

    it("completedCount is 0 for empty profile", () => {
        const result = computeProfileCompleteness(EMPTY_INPUT);
        expect(result.completedCount).toBe(0);
    });

    it("completedCount is 8 for full profile", () => {
        const result = computeProfileCompleteness(FULL_INPUT);
        expect(result.completedCount).toBe(8);
    });

    it("totalCount is always 8", () => {
        expect(computeProfileCompleteness(EMPTY_INPUT).totalCount).toBe(8);
        expect(computeProfileCompleteness(FULL_INPUT).totalCount).toBe(8);
    });

    it("avatar item is done when image is provided", () => {
        const result = computeProfileCompleteness({ ...EMPTY_INPUT, image: "https://cdn.example.com/img.jpg" });
        const avatarItem = result.items.find((i) => i.key === "avatar");
        expect(avatarItem?.done).toBe(true);
    });

    it("avatar item is not done for whitespace-only image", () => {
        const result = computeProfileCompleteness({ ...EMPTY_INPUT, image: "   " });
        const avatarItem = result.items.find((i) => i.key === "avatar");
        expect(avatarItem?.done).toBe(false);
    });

    it("firstLink item done with 1 link", () => {
        const result = computeProfileCompleteness({ ...EMPTY_INPUT, publicLinkCount: 1 });
        const item = result.items.find((i) => i.key === "firstLink");
        expect(item?.done).toBe(true);
    });

    it("threeLinks item not done with only 2 links", () => {
        const result = computeProfileCompleteness({ ...EMPTY_INPUT, publicLinkCount: 2 });
        const item = result.items.find((i) => i.key === "threeLinks");
        expect(item?.done).toBe(false);
    });

    it("verified item done when isVerified is true", () => {
        const result = computeProfileCompleteness({ ...EMPTY_INPUT, isVerified: true });
        const item = result.items.find((i) => i.key === "verified");
        expect(item?.done).toBe(true);
    });

    it("score increases with each completed item", () => {
        const withBio = computeProfileCompleteness({ ...EMPTY_INPUT, bio: "Hello" });
        expect(withBio.score).toBeGreaterThan(0);
        expect(withBio.score).toBeLessThan(100);
    });
});
