import { isPrivateIp } from "./analyticsUtils";

describe("isPrivateIp — complete RFC-1918 coverage", () => {
    describe("10.0.0.0/8 — Class A private", () => {
        it("10.0.0.0 is private", () => expect(isPrivateIp("10.0.0.0")).toBe(true));
        it("10.255.255.255 is private", () => expect(isPrivateIp("10.255.255.255")).toBe(true));
        it("10.0.0.1 is private", () => expect(isPrivateIp("10.0.0.1")).toBe(true));
        it("11.0.0.0 is NOT 10.x.x.x private range", () => expect(isPrivateIp("11.0.0.0")).toBe(false));
    });

    describe("172.16.0.0/12 — Class B private", () => {
        it("172.16.0.0 is private (lower bound)", () => expect(isPrivateIp("172.16.0.0")).toBe(true));
        it("172.31.255.255 is private (upper bound)", () => expect(isPrivateIp("172.31.255.255")).toBe(true));
        it("172.20.0.1 is private (middle)", () => expect(isPrivateIp("172.20.0.1")).toBe(true));
        it("172.15.255.255 is NOT in range", () => expect(isPrivateIp("172.15.255.255")).toBe(false));
        it("172.32.0.0 is NOT in range", () => expect(isPrivateIp("172.32.0.0")).toBe(false));
    });

    describe("192.168.0.0/16 — Class C private", () => {
        it("192.168.0.0 is private", () => expect(isPrivateIp("192.168.0.0")).toBe(true));
        it("192.168.255.255 is private", () => expect(isPrivateIp("192.168.255.255")).toBe(true));
        it("192.168.100.50 is private", () => expect(isPrivateIp("192.168.100.50")).toBe(true));
        it("192.167.0.0 is NOT private", () => expect(isPrivateIp("192.167.0.0")).toBe(false));
        it("192.169.0.0 is NOT private", () => expect(isPrivateIp("192.169.0.0")).toBe(false));
    });

    describe("127.0.0.0/8 — Loopback", () => {
        it("127.0.0.1 is loopback", () => expect(isPrivateIp("127.0.0.1")).toBe(true));
        it("127.255.255.255 is loopback", () => expect(isPrivateIp("127.255.255.255")).toBe(true));
        it("128.0.0.0 is NOT loopback", () => expect(isPrivateIp("128.0.0.0")).toBe(false));
    });

    describe("Public IP ranges", () => {
        it("8.8.8.8 is public", () => expect(isPrivateIp("8.8.8.8")).toBe(false));
        it("1.1.1.1 is public", () => expect(isPrivateIp("1.1.1.1")).toBe(false));
        it("203.0.113.1 is public (TEST-NET)", () => expect(isPrivateIp("203.0.113.1")).toBe(false));
    });
});
