/**
 * Security-focused combined tests for analytics utilities.
 * Tests that sensitive functions resist common attack patterns.
 */
import { isPrivateIp, getForwardedIp, isLikelyBot, getVisitorKey } from "./analyticsUtils";

describe("Analytics security — IP spoofing resistance", () => {
    it("rejects private IP from x-forwarded-for when x-real-ip is public", () => {
        // Public x-real-ip means the client is directly connected (no trusted proxy).
        // x-forwarded-for could be client-injected — use x-real-ip directly.
        const headers = new Headers({
            "x-real-ip": "203.0.113.50",  // public
            "x-forwarded-for": "10.0.0.1, 203.0.113.50",  // client-injected private IP first
        });
        const ip = getForwardedIp(headers);
        // Should use x-real-ip (203.0.113.50), not the potentially spoofed XFF
        expect(ip).toBe("203.0.113.50");
        expect(isPrivateIp(ip!)).toBe(false);
    });

    it("allows trusted proxy chain when x-real-ip is internal", () => {
        const headers = new Headers({
            "x-real-ip": "10.0.0.1",  // trusted internal proxy
            "x-forwarded-for": "203.0.113.99",
        });
        const ip = getForwardedIp(headers);
        expect(ip).toBe("203.0.113.99");
    });

    it("getVisitorKey: IP spoofing attempt produces different key", () => {
        const base = { ip: "1.2.3.4", userAgent: "Chrome", acceptLanguage: "en" };
        const spoofed = { ip: "10.0.0.1", userAgent: "Chrome", acceptLanguage: "en" };
        const k1 = getVisitorKey(base);
        const k2 = getVisitorKey(spoofed);
        expect(k1).not.toBe(k2);
    });
});

describe("Analytics security — bot bypass attempts", () => {
    it("empty user agent is treated as bot", () => {
        expect(isLikelyBot("")).toBe(true);
    });

    it("undefined user agent is treated as bot", () => {
        expect(isLikelyBot(undefined)).toBe(true);
    });

    it("user agent containing 'bot' substring is detected", () => {
        expect(isLikelyBot("MyCustomBot/1.0")).toBe(true);
    });

    it("user agent with 'crawler' is detected", () => {
        expect(isLikelyBot("Web Crawler 2.0")).toBe(true);
    });

    it("legitimate user agent is not blocked", () => {
        const realUA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 13) AppleWebKit/537.36 Safari/537.36";
        expect(isLikelyBot(realUA)).toBe(false);
    });
});
