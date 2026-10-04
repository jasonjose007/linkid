import {
    isPrivateIp,
    getForwardedIp,
    isLikelyBot,
    detectDeviceType,
    utcDayStart,
    utcDayEndExclusive,
} from "./analyticsUtils";

describe("isPrivateIp", () => {
    it("detects 10.x.x.x as private", () => expect(isPrivateIp("10.0.0.1")).toBe(true));
    it("detects 192.168.x.x as private", () => expect(isPrivateIp("192.168.1.1")).toBe(true));
    it("detects 172.16.x.x as private", () => expect(isPrivateIp("172.16.0.1")).toBe(true));
    it("detects 127.x.x.x as loopback", () => expect(isPrivateIp("127.0.0.1")).toBe(true));
    it("returns false for public IP", () => expect(isPrivateIp("8.8.8.8")).toBe(false));
    it("returns false for invalid string", () => expect(isPrivateIp("not-an-ip")).toBe(false));
});

describe("getForwardedIp", () => {
    it("returns x-real-ip when it is a public IP", () => {
        const headers = new Headers({ "x-real-ip": "8.8.8.8" });
        expect(getForwardedIp(headers)).toBe("8.8.8.8");
    });

    it("uses x-forwarded-for first hop when x-real-ip is private", () => {
        const headers = new Headers({
            "x-real-ip": "192.168.1.1",
            "x-forwarded-for": "203.0.113.5, 10.0.0.1",
        });
        expect(getForwardedIp(headers)).toBe("203.0.113.5");
    });

    it("returns null when no IP headers present", () => {
        expect(getForwardedIp(new Headers())).toBeNull();
    });
});

describe("isLikelyBot", () => {
    it("returns true for Googlebot user agent", () => {
        expect(isLikelyBot("Mozilla/5.0 (compatible; Googlebot/2.1)")).toBe(true);
    });

    it("returns true for null user agent", () => {
        expect(isLikelyBot(null)).toBe(true);
    });

    it("returns false for Chrome user agent", () => {
        expect(isLikelyBot("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120")).toBe(false);
    });
});

describe("detectDeviceType", () => {
    it("detects mobile user agent", () => {
        expect(detectDeviceType("Mozilla/5.0 (iPhone; CPU iPhone OS 16_0)")).toBe("mobile");
    });

    it("detects tablet user agent", () => {
        expect(detectDeviceType("Mozilla/5.0 (iPad; CPU OS 16_0)")).toBe("tablet");
    });

    it("detects desktop user agent", () => {
        expect(detectDeviceType("Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120")).toBe("desktop");
    });

    it("returns unknown for null", () => {
        expect(detectDeviceType(null)).toBe("unknown");
    });
});

describe("utcDayStart / utcDayEndExclusive", () => {
    it("utcDayStart returns midnight UTC", () => {
        const d = new Date("2026-10-04T15:30:00Z");
        const start = utcDayStart(d);
        expect(start.toISOString()).toBe("2026-10-04T00:00:00.000Z");
    });

    it("utcDayEndExclusive is exactly 24h after start", () => {
        const d = new Date("2026-10-04T00:00:00Z");
        const end = utcDayEndExclusive(d);
        expect(end.getTime() - utcDayStart(d).getTime()).toBe(24 * 60 * 60 * 1000);
    });
});
