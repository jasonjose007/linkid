import { getForwardedIp } from "./analyticsUtils";

describe("getForwardedIp — edge cases", () => {
    it("returns null when x-real-ip has only whitespace", () => {
        const headers = new Headers({ "x-real-ip": "   " });
        // Trim is applied; empty string is falsy → returns null
        expect(getForwardedIp(headers)).toBeNull();
    });

    it("handles x-forwarded-for with multiple IPs and picks first", () => {
        const headers = new Headers({
            "x-real-ip": "10.0.0.1",
            "x-forwarded-for": "203.0.113.5, 10.0.0.2, 192.168.0.1",
        });
        expect(getForwardedIp(headers)).toBe("203.0.113.5");
    });

    it("handles x-real-ip with IPv4", () => {
        const headers = new Headers({ "x-real-ip": "45.67.89.10" });
        expect(getForwardedIp(headers)).toBe("45.67.89.10");
    });

    it("handles x-forwarded-for with single IP and private x-real-ip", () => {
        const headers = new Headers({
            "x-real-ip": "172.16.0.1",
            "x-forwarded-for": "99.99.99.99",
        });
        expect(getForwardedIp(headers)).toBe("99.99.99.99");
    });

    it("returns x-real-ip when x-forwarded-for is absent but x-real-ip is private", () => {
        const headers = new Headers({
            "x-real-ip": "192.168.1.1",
            // No x-forwarded-for
        });
        // Since x-real-ip is private but no XFF available, should fall back to x-real-ip
        const ip = getForwardedIp(headers);
        expect(ip).toBe("192.168.1.1");
    });

    it("returns x-real-ip when x-forwarded-for is present but empty string", () => {
        const headers = new Headers({
            "x-real-ip": "10.0.0.1",
            "x-forwarded-for": "",
        });
        expect(getForwardedIp(headers)).toBe("10.0.0.1");
    });
});
