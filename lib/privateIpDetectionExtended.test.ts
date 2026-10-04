import { isPrivateIp } from "./analyticsUtils";

describe("isPrivateIp — input validation and error handling", () => {
    describe("Valid IP format validation", () => {
        it("accepts single-digit octets", () => {
            expect(isPrivateIp("10.0.0.0")).toBe(true);
        });

        it("accepts mixed single and three-digit octets", () => {
            expect(isPrivateIp("192.168.1.255")).toBe(true);
        });
    });

    describe("Invalid IP format handling", () => {
        it("returns false for IPv6 address", () => {
            expect(isPrivateIp("::1")).toBe(false);
        });

        it("returns false for hostname", () => {
            expect(isPrivateIp("localhost")).toBe(false);
        });

        it("returns false for octet > 255", () => {
            expect(isPrivateIp("256.0.0.1")).toBe(false);
        });

        it("returns false for negative octet", () => {
            expect(isPrivateIp("-1.0.0.1")).toBe(false);
        });

        it("returns false for 3 octets only", () => {
            expect(isPrivateIp("192.168.1")).toBe(false);
        });

        it("returns false for 5 octets", () => {
            expect(isPrivateIp("192.168.1.1.1")).toBe(false);
        });

        it("returns false for empty string", () => {
            expect(isPrivateIp("")).toBe(false);
        });

        it("returns false for non-numeric octet", () => {
            expect(isPrivateIp("abc.def.ghi.jkl")).toBe(false);
        });

        it("returns false for CIDR notation", () => {
            expect(isPrivateIp("10.0.0.0/8")).toBe(false);
        });
    });

    describe("Edge case IP values", () => {
        it("0.0.0.0 is not private (but not public either)", () => {
            expect(isPrivateIp("0.0.0.0")).toBe(false);
        });

        it("255.255.255.255 is not in any private range", () => {
            expect(isPrivateIp("255.255.255.255")).toBe(false);
        });
    });
});
