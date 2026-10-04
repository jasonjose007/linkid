import { getVisitorKey } from "./analyticsUtils";

describe("getVisitorKey — privacy and security properties", () => {
    const BASE = {
        ip: "203.0.113.50",
        userAgent: "Mozilla/5.0 Chrome/120",
        acceptLanguage: "en-US",
    };

    it("key is a one-way hash — cannot extract IP from key", () => {
        const key = getVisitorKey(BASE);
        expect(key).not.toContain(BASE.ip);
        expect(key).not.toContain("203");
    });

    it("key does not contain user agent string", () => {
        const key = getVisitorKey(BASE);
        expect(key).not.toContain("Mozilla");
        expect(key).not.toContain("Chrome");
    });

    it("key is always exactly 64 hex chars (SHA-256)", () => {
        for (let i = 0; i < 5; i++) {
            const key = getVisitorKey({ ...BASE, ip: `10.${i}.0.1` });
            if (key) {
                expect(key).toMatch(/^[a-f0-9]{64}$/);
            }
        }
    });

    it("changing any single field changes the key", () => {
        const k0 = getVisitorKey(BASE);
        const k1 = getVisitorKey({ ...BASE, ip: "203.0.113.51" });
        const k2 = getVisitorKey({ ...BASE, userAgent: "Firefox/120" });
        const k3 = getVisitorKey({ ...BASE, acceptLanguage: "de-DE" });
        expect(k0).not.toBe(k1);
        expect(k0).not.toBe(k2);
        expect(k0).not.toBe(k3);
    });

    it("key is null when both ip and userAgent are null", () => {
        expect(getVisitorKey({ ip: null, userAgent: null, acceptLanguage: "en" })).toBeNull();
    });

    it("key is null when ip is null", () => {
        expect(getVisitorKey({ ip: null, userAgent: "Chrome", acceptLanguage: "en" })).toBeNull();
    });

    it("key is null when userAgent is null", () => {
        expect(getVisitorKey({ ip: "1.2.3.4", userAgent: null, acceptLanguage: "en" })).toBeNull();
    });
});
