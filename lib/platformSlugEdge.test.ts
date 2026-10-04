import { slugifyPlatform } from "./platforms";

describe("slugifyPlatform — comprehensive edge cases", () => {
    it("handles all uppercase", () => {
        expect(slugifyPlatform("GITHUB")).toBe("github");
    });

    it("handles camelCase", () => {
        expect(slugifyPlatform("devTo")).toBe("devto");
    });

    it("handles multiple consecutive spaces", () => {
        expect(slugifyPlatform("My   Platform")).toBe("my-platform");
    });

    it("handles tab character", () => {
        expect(slugifyPlatform("my\tplatform")).toBe("myplatform");
    });

    it("handles newline character", () => {
        expect(slugifyPlatform("my\nplatform")).toBe("myplatform");
    });

    it("handles unicode letters by removing them", () => {
        // Non-ASCII letters are stripped
        expect(slugifyPlatform("résumé")).toBe("rsum");
    });

    it("preserves already-valid slug", () => {
        expect(slugifyPlatform("github")).toBe("github");
    });

    it("handles single hyphen input", () => {
        expect(slugifyPlatform("-")).toBe("-");
    });

    it("handles numbers-only input", () => {
        expect(slugifyPlatform("123")).toBe("123");
    });

    it("handles whitespace-only returns empty string", () => {
        expect(slugifyPlatform("   ")).toBe("");
    });
});
