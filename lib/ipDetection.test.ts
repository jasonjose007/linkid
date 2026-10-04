import { isPrivateIp, getForwardedIp } from "./analyticsUtils";

describe("isPrivateIp — comprehensive range coverage", () => {
    describe("10.x.x.x class A private", () => {
        it("detects 10.0.0.0 (network address)", () => expect(isPrivateIp("10.0.0.0")).toBe(true));
        it("detects 10.255.255.255 (broadcast)", () => expect(isPrivateIp("10.255.255.255")).toBe(true));
        it("detects 10.100.50.25", () => expect(isPrivateIp("10.100.50.25")).toBe(true));
    });

    describe("172.16-31.x.x class B private", () => {
        it("detects 172.16.0.0 (lower bound)", () => expect(isPrivateIp("172.16.0.0")).toBe(true));
        it("detects 172.31.255.255 (upper bound)", () => expect(isPrivateIp("172.31.255.255")).toBe(true));
        it("does NOT detect 172.15.0.0 (out of range)", () => expect(isPrivateIp("172.15.0.0")).toBe(false));
        it("does NOT detect 172.32.0.0 (out of range)", () => expect(isPrivateIp("172.32.0.0")).toBe(false));
    });

    describe("192.168.x.x class C private", () => {
        it("detects 192.168.0.0", () => expect(isPrivateIp("192.168.0.0")).toBe(true));
        it("detects 192.168.255.255", () => expect(isPrivateIp("192.168.255.255")).toBe(true));
        it("does NOT detect 192.167.0.0", () => expect(isPrivateIp("192.167.0.0")).toBe(false));
        it("does NOT detect 192.169.0.0", () => expect(isPrivateIp("192.169.0.0")).toBe(false));
    });

    describe("loopback", () => {
        it("detects 127.0.0.1", () => expect(isPrivateIp("127.0.0.1")).toBe(true));
        it("detects 127.255.255.255", () => expect(isPrivateIp("127.255.255.255")).toBe(true));
    });

    describe("invalid input", () => {
        it("returns false for IPv6", () => expect(isPrivateIp("::1")).toBe(false));
        it("returns false for hostname", () => expect(isPrivateIp("localhost")).toBe(false));
        it("returns false for octet out of range", () => expect(isPrivateIp("256.0.0.1")).toBe(false));
    });
});

describe("getForwardedIp — trusted proxy chain", () => {
    it("returns null when no headers at all", () => {
        expect(getForwardedIp(new Headers())).toBeNull();
    });

    it("uses x-forwarded-for second hop if first is also private", () => {
        const headers = new Headers({
            "x-real-ip": "192.168.1.1",
            "x-forwarded-for": "10.0.0.5, 203.0.113.99",
        });
        // First hop of x-forwarded-for is taken (regardless of its own privacy)
        expect(getForwardedIp(headers)).toBe("10.0.0.5");
    });
});
