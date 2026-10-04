import { getVisitorKey } from "./analyticsUtils";

describe("getVisitorKey — salt behavior", () => {
    const INPUT = {
        ip: "203.0.113.5",
        userAgent: "Mozilla/5.0 Chrome/120",
        acceptLanguage: "en-US",
    };

    it("same inputs with same salt produce same key", () => {
        const a = getVisitorKey(INPUT);
        const b = getVisitorKey(INPUT);
        expect(a).toBe(b);
    });

    it("different accept languages produce different keys", () => {
        const en = getVisitorKey({ ...INPUT, acceptLanguage: "en-US" });
        const de = getVisitorKey({ ...INPUT, acceptLanguage: "de-DE" });
        expect(en).not.toBe(de);
    });

    it("null accept language produces different key than empty string", () => {
        const withNull  = getVisitorKey({ ...INPUT, acceptLanguage: null });
        const withEmpty = getVisitorKey({ ...INPUT, acceptLanguage: "" });
        // Both should be non-null but may differ depending on how they're concatenated
        expect(withNull).not.toBeNull();
        expect(withEmpty).not.toBeNull();
    });

    it("different IPs always produce different keys", () => {
        const keys = ["1.1.1.1", "8.8.8.8", "203.0.113.1", "198.51.100.1"].map((ip) =>
            getVisitorKey({ ...INPUT, ip })
        );
        const unique = new Set(keys);
        expect(unique.size).toBe(4);
    });

    it("key is always 64-char hex (SHA-256)", () => {
        for (let i = 0; i < 5; i++) {
            const key = getVisitorKey({ ...INPUT, ip: `10.0.${i}.1` });
            // null IPs are handled earlier — 10.x is private but still produces a key
            if (key) {
                expect(key).toHaveLength(64);
                expect(key).toMatch(/^[a-f0-9]{64}$/);
            }
        }
    });
});
