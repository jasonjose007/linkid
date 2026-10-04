import { detectDeviceType } from "./analyticsUtils";

describe("detectDeviceType — comprehensive user agent detection", () => {
    describe("Mobile phones", () => {
        const MOBILE_UAS = [
            "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)",
            "Mozilla/5.0 (Linux; Android 13; Samsung Galaxy S23)",
            "Mozilla/5.0 (Linux; Android 12) Mobile Safari",
            "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4 like Mac OS X) Mobile/15E148",
        ];

        MOBILE_UAS.forEach((ua) => {
            it(`mobile: ${ua.slice(0, 45)}`, () => {
                expect(detectDeviceType(ua)).toBe("mobile");
            });
        });
    });

    describe("Tablets", () => {
        const TABLET_UAS = [
            "Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) Safari/604.1",
            "Mozilla/5.0 (Linux; Android 12; Tablet Build/SP1A.210812)",
        ];

        TABLET_UAS.forEach((ua) => {
            it(`tablet: ${ua.slice(0, 45)}`, () => {
                expect(detectDeviceType(ua)).toBe("tablet");
            });
        });
    });

    describe("Desktop", () => {
        const DESKTOP_UAS = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 13) Safari/605.1",
            "Mozilla/5.0 (X11; Ubuntu; Linux x86_64) Firefox/121",
        ];

        DESKTOP_UAS.forEach((ua) => {
            it(`desktop: ${ua.slice(0, 45)}`, () => {
                expect(detectDeviceType(ua)).toBe("desktop");
            });
        });
    });

    describe("Edge cases", () => {
        it("null returns unknown", () => expect(detectDeviceType(null)).toBe("unknown"));
        it("undefined returns unknown", () => expect(detectDeviceType(undefined)).toBe("unknown"));
        it("empty string returns unknown", () => expect(detectDeviceType("")).toBe("unknown"));
    });
});
