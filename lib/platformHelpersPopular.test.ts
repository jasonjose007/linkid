import { POPULAR_PLATFORMS, formatLabel } from "./platformHelpers";
import { PLATFORMS } from "./constants";

describe("POPULAR_PLATFORMS — content and ordering", () => {
    it("website appears as last entry", () => {
        const last = POPULAR_PLATFORMS[POPULAR_PLATFORMS.length - 1];
        expect(last.value).toBe(PLATFORMS.WEBSITE);
    });

    it("website label is 'Personal Website / Other'", () => {
        const website = POPULAR_PLATFORMS.find((p) => p.value === PLATFORMS.WEBSITE);
        expect(website?.label).toBe("Personal Website / Other");
    });

    it("all labels match formatLabel output for the value", () => {
        for (const platform of POPULAR_PLATFORMS) {
            if (platform.value !== PLATFORMS.WEBSITE) {
                // For non-website platforms, label should match formatLabel
                const expected = formatLabel(platform.value);
                expect(platform.label).toBe(expected);
            }
        }
    });

    it("contains GitHub", () => {
        expect(POPULAR_PLATFORMS.some((p) => p.value === PLATFORMS.GITHUB)).toBe(true);
    });

    it("contains LinkedIn", () => {
        expect(POPULAR_PLATFORMS.some((p) => p.value === PLATFORMS.LINKEDIN)).toBe(true);
    });

    it("contains YouTube", () => {
        expect(POPULAR_PLATFORMS.some((p) => p.value === PLATFORMS.YOUTUBE)).toBe(true);
    });

    it("contains Twitter/X", () => {
        const hasX = POPULAR_PLATFORMS.some((p) => p.value === PLATFORMS.X || p.value === PLATFORMS.TWITTER);
        expect(hasX).toBe(true);
    });

    it("does not contain 'portfolio' as a value", () => {
        expect(POPULAR_PLATFORMS.some((p) => p.value === "portfolio")).toBe(false);
    });
});
