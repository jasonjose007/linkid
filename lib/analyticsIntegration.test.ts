/**
 * Integration tests combining multiple analytics utilities.
 */
import { isPrivateIp, getForwardedIp, isLikelyBot, detectDeviceType, utcDayStart, utcDayEndExclusive } from "./analyticsUtils";
import { computePercentChange, buildTopBreakdown } from "./analyticsMath";

describe("Analytics utilities integration", () => {
    describe("Bot filtering with device detection", () => {
        it("bot user agent is detected and device type is unknown", () => {
            const ua = "Googlebot/2.1 (+http://www.google.com/bot.html)";
            expect(isLikelyBot(ua)).toBe(true);
            expect(detectDeviceType(ua)).toBe("desktop");
        });

        it("real mobile user passes bot check", () => {
            const ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0) AppleWebKit/605.1.15";
            expect(isLikelyBot(ua)).toBe(false);
            expect(detectDeviceType(ua)).toBe("mobile");
        });
    });

    describe("IP handling with forwarded IP validation", () => {
        it("private upstream IP uses x-forwarded-for", () => {
            const headers = new Headers({
                "x-real-ip": "10.0.0.1",
                "x-forwarded-for": "203.0.113.99",
            });
            const ip = getForwardedIp(headers);
            expect(ip).toBe("203.0.113.99");
            expect(isPrivateIp(ip!)).toBe(false);
        });

        it("public real IP is used directly", () => {
            const headers = new Headers({ "x-real-ip": "8.8.8.8" });
            const ip = getForwardedIp(headers);
            expect(ip).toBe("8.8.8.8");
            expect(isPrivateIp(ip!)).toBe(false);
        });
    });

    describe("UTC day boundary calculations", () => {
        it("day start is 24 hours before day end", () => {
            const d = new Date("2026-10-04T12:00:00Z");
            const start = utcDayStart(d);
            const end = utcDayEndExclusive(d);
            expect(end.getTime() - start.getTime()).toBe(24 * 60 * 60 * 1000);
        });

        it("day start is midnight UTC", () => {
            const d = new Date("2026-10-04T23:59:59Z");
            expect(utcDayStart(d).toISOString()).toBe("2026-10-04T00:00:00.000Z");
        });
    });

    describe("Percent change and breakdown combined", () => {
        it("new entries appear as new and top breakdown reflects counts", () => {
            const change = computePercentChange(100, 0);
            expect(change).toBe("new");

            const breakdown = buildTopBreakdown([{ key: "US", count: 100 }], "Unknown");
            expect(breakdown[0].label).toBe("US");
        });

        it("100% growth reflected in breakdown", () => {
            const change = computePercentChange(200, 100);
            expect(change).toBe(100);
        });
    });
});
