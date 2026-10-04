import { validateUrlBackend, isSafeRedirectUrl, validateUrl } from "./urlValidation";

describe("URL validation — edge cases and security", () => {
    describe("SSRF prevention in validateUrlBackend", () => {
        it("rejects 172.16.0.1 (private range)", () => {
            expect(validateUrlBackend("http://172.16.0.1").valid).toBe(false);
        });

        it("rejects 172.31.255.255 (private range upper bound)", () => {
            expect(validateUrlBackend("http://172.31.255.255").valid).toBe(false);
        });

        it("accepts 172.32.0.1 (outside private range)", () => {
            expect(validateUrlBackend("http://172.32.0.1").valid).toBe(true);
        });

        it("rejects link-local 169.254.0.1", () => {
            expect(validateUrlBackend("http://169.254.0.1").valid).toBe(false);
        });

        it("rejects IPv6 fe80:: (link-local)", () => {
            expect(validateUrlBackend("http://[fe80::1]").valid).toBe(false);
        });

        it("normalizes trailing slash away", () => {
            const result = validateUrlBackend("https://example.com/");
            expect(result.valid).toBe(true);
            if (result.valid) {
                expect(result.normalizedUrl.endsWith("/")).toBe(false);
            }
        });
    });

    describe("isSafeRedirectUrl — additional schemes", () => {
        it("rejects file:// scheme", () => {
            expect(isSafeRedirectUrl("file:///etc/passwd")).toBe(false);
        });

        it("rejects ftp:// scheme", () => {
            expect(isSafeRedirectUrl("ftp://ftp.example.com")).toBe(false);
        });

        it("accepts https with path and fragment", () => {
            expect(isSafeRedirectUrl("https://example.com/page#section")).toBe(true);
        });
    });

    describe("validateUrl — scheme inference", () => {
        it("accepts domain with subdomain", () => {
            expect(validateUrl("api.example.com").valid).toBe(true);
        });

        it("accepts URL with port", () => {
            expect(validateUrl("https://example.com:3000").valid).toBe(true);
        });

        it("rejects URL with only TLD (no domain)", () => {
            expect(validateUrl("https://.com").valid).toBe(false);
        });

        it("rejects URL with empty parts in domain", () => {
            expect(validateUrl("https://google..com").valid).toBe(false);
        });
    });
});
