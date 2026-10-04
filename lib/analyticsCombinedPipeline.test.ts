/**
 * End-to-end analytics pipeline tests combining multiple utility functions.
 */
import { isPrivateIp, getForwardedIp, isLikelyBot, detectDeviceType, getVisitorKey, utcDayStart } from "./analyticsUtils";
import { computePercentChange, buildTopBreakdown } from "./analyticsMath";

describe("Analytics pipeline — realistic click tracking scenario", () => {
    const REAL_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120";
    const BOT_UA = "Googlebot/2.1 (+http://www.google.com/bot.html)";

    describe("Visitor key generation pipeline", () => {
        it("generates a key for a legitimate visitor", () => {
            const headers = new Headers({
                "x-real-ip": "203.0.113.50",
                "x-forwarded-for": "203.0.113.50",
            });
            const ip = getForwardedIp(headers);
            expect(ip).not.toBeNull();
            expect(isPrivateIp(ip!)).toBe(false);
            expect(isLikelyBot(REAL_UA)).toBe(false);

            const key = getVisitorKey({ ip, userAgent: REAL_UA, acceptLanguage: "en-US" });
            expect(key).not.toBeNull();
            expect(key).toHaveLength(64);
        });

        it("does not generate key for bot (isLikelyBot check)", () => {
            expect(isLikelyBot(BOT_UA)).toBe(true);
        });

        it("does not generate key for private IP (null check)", () => {
            const key = getVisitorKey({ ip: null, userAgent: REAL_UA, acceptLanguage: "en" });
            expect(key).toBeNull();
        });
    });

    describe("Day boundary + breakdown analytics", () => {
        it("day start is correct for a click timestamp", () => {
            const clickTime = new Date("2026-10-04T15:30:00Z");
            const dayStart = utcDayStart(clickTime);
            expect(dayStart.toISOString()).toBe("2026-10-04T00:00:00.000Z");
        });

        it("percent change correctly shows growth from yesterday to today", () => {
            const yesterday = 120;
            const today = 156;
            const change = computePercentChange(today, yesterday);
            expect(change).toBe(30);
        });

        it("top referrer breakdown shows Google as #1", () => {
            const referrers = [
                { key: "google.com", count: 500 },
                { key: "direct", count: 300 },
                { key: "twitter.com", count: 100 },
            ];
            const breakdown = buildTopBreakdown(referrers, "Direct");
            expect(breakdown[0].label).toBe("google.com");
        });
    });

    describe("Device type distribution", () => {
        const userAgents = [
            { ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0) AppleWebKit", expected: "mobile" },
            { ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120", expected: "desktop" },
            { ua: "Mozilla/5.0 (iPad; CPU OS 16_0) AppleWebKit", expected: "tablet" },
        ];

        userAgents.forEach(({ ua, expected }) => {
            it(`detects ${expected} from user agent`, () => {
                expect(detectDeviceType(ua)).toBe(expected);
            });
        });
    });
});
