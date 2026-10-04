/**
 * Final combined analytics tests verifying all utility functions together.
 */
import {
    isPrivateIp, getForwardedIp, isLikelyBot, detectDeviceType,
    getVisitorKey, utcDayStart, utcDayEndExclusive
} from "./analyticsUtils";
import { computePercentChange, buildTopBreakdown } from "./analyticsMath";

describe("Analytics — final combined verification", () => {
    it("full click event processing pipeline", () => {
        // Simulate a real click event
        const headers = new Headers({ "x-real-ip": "203.0.113.99" });
        const ip = getForwardedIp(headers);
        const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120";
        const lang = "en-US";

        // Step 1: IP check
        expect(ip).not.toBeNull();
        expect(isPrivateIp(ip!)).toBe(false);

        // Step 2: Bot check
        expect(isLikelyBot(ua)).toBe(false);

        // Step 3: Device detection
        expect(detectDeviceType(ua)).toBe("desktop");

        // Step 4: Visitor key
        const key = getVisitorKey({ ip, userAgent: ua, acceptLanguage: lang });
        expect(key).toHaveLength(64);

        // Step 5: Day boundary
        const clickTime = new Date("2026-10-04T14:30:00Z");
        const dayStart = utcDayStart(clickTime);
        const dayEnd = utcDayEndExclusive(clickTime);
        expect(clickTime.getTime()).toBeGreaterThan(dayStart.getTime());
        expect(clickTime.getTime()).toBeLessThan(dayEnd.getTime());
    });

    it("daily analytics summary scenario", () => {
        // Today vs yesterday click counts
        const today = 1500;
        const yesterday = 1000;
        const growthRate = computePercentChange(today, yesterday);
        expect(growthRate).toBe(50);

        // Top referrers
        const referrers = [
            { key: "google.com", count: 700 },
            { key: "direct", count: 400 },
            { key: "twitter.com", count: 200 },
            { key: "linkedin.com", count: 150 },
            { key: "github.com", count: 50 },
        ];
        const breakdown = buildTopBreakdown(referrers, "Unknown");
        expect(breakdown[0].label).toBe("google.com");
        expect(breakdown.find((r) => r.label === "Other")).toBeUndefined(); // <8 entries
    });
});
