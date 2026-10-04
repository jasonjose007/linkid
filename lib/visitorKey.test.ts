import { getVisitorKey } from "./analyticsUtils";

describe("getVisitorKey", () => {
    const validInput = {
        ip: "203.0.113.1",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120",
        acceptLanguage: "en-US,en;q=0.9",
    };

    it("returns a 64-char hex string for valid input", () => {
        const key = getVisitorKey(validInput);
        expect(key).not.toBeNull();
        expect(key).toHaveLength(64);
        expect(key).toMatch(/^[a-f0-9]{64}$/);
    });

    it("returns null when ip is null", () => {
        expect(getVisitorKey({ ...validInput, ip: null })).toBeNull();
    });

    it("returns null when userAgent is null", () => {
        expect(getVisitorKey({ ...validInput, userAgent: null })).toBeNull();
    });

    it("returns null when both ip and userAgent are null", () => {
        expect(getVisitorKey({ ip: null, userAgent: null, acceptLanguage: null })).toBeNull();
    });

    it("is deterministic — same inputs produce same key", () => {
        const a = getVisitorKey(validInput);
        const b = getVisitorKey(validInput);
        expect(a).toBe(b);
    });

    it("different IPs produce different keys", () => {
        const key1 = getVisitorKey({ ...validInput, ip: "1.2.3.4" });
        const key2 = getVisitorKey({ ...validInput, ip: "5.6.7.8" });
        expect(key1).not.toBe(key2);
    });

    it("different user agents produce different keys", () => {
        const key1 = getVisitorKey({ ...validInput, userAgent: "Chrome/120" });
        const key2 = getVisitorKey({ ...validInput, userAgent: "Firefox/120" });
        expect(key1).not.toBe(key2);
    });

    it("handles null acceptLanguage gracefully", () => {
        const key = getVisitorKey({ ...validInput, acceptLanguage: null });
        expect(key).not.toBeNull();
        expect(key).toHaveLength(64);
    });
});
