import { slugifyPlatform } from "./platforms";

describe("slugifyPlatform", () => {
    it("lowercases and trims", () => {
        expect(slugifyPlatform("  GitHub  ")).toBe("github");
    });

    it("replaces spaces with hyphens", () => {
        expect(slugifyPlatform("My Platform")).toBe("my-platform");
    });

    it("removes special characters", () => {
        expect(slugifyPlatform("Dev.to!")).toBe("devto");
    });

    it("returns empty string for null", () => {
        expect(slugifyPlatform(null)).toBe("");
    });

    it("returns empty string for undefined", () => {
        expect(slugifyPlatform(undefined)).toBe("");
    });

    it("returns empty string for empty string", () => {
        expect(slugifyPlatform("")).toBe("");
    });

    it("preserves hyphens in input", () => {
        expect(slugifyPlatform("x-twitter")).toBe("x-twitter");
    });

    it("preserves numbers", () => {
        expect(slugifyPlatform("Web3 Platform")).toBe("web3-platform");
    });

    it("collapses multiple spaces into single hyphen", () => {
        expect(slugifyPlatform("a  b")).toBe("a-b");
    });
});
