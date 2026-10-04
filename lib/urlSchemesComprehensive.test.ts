import { isSafeRedirectUrl, validateUrl, validateUrlBackend } from "./urlValidation";

describe("URL scheme and protocol handling", () => {
    describe("isSafeRedirectUrl — exhaustive scheme tests", () => {
        const dangerousSchemes = [
            "javascript:void(0)",
            "javascript:alert(document.cookie)",
            "data:text/html,<script>alert(1)</script>",
            "data:application/octet-stream;base64,abc",
            "vbscript:msgbox('xss')",
            "file:///etc/passwd",
            "ftp://evil.com/file",
            "sftp://server.com",
            "ssh://user@host",
            "telnet://host:23",
        ];

        dangerousSchemes.forEach((url) => {
            it(`blocks '${url.slice(0, 30)}'`, () => {
                expect(isSafeRedirectUrl(url)).toBe(false);
            });
        });

        const safeUrls = [
            "https://example.com",
            "http://example.com",
            "https://subdomain.example.com/path?q=1#fragment",
        ];

        safeUrls.forEach((url) => {
            it(`allows '${url}'`, () => {
                expect(isSafeRedirectUrl(url)).toBe(true);
            });
        });
    });

    describe("validateUrlBackend — domain validation", () => {
        it("accepts two-letter TLD (.io)", () => {
            expect(validateUrlBackend("https://myapp.io").valid).toBe(true);
        });

        it("accepts long TLD (.museum)", () => {
            expect(validateUrlBackend("https://example.museum").valid).toBe(true);
        });

        it("rejects single-character TLD", () => {
            expect(validateUrlBackend("https://example.c").valid).toBe(false);
        });

        it("rejects numeric TLD", () => {
            expect(validateUrlBackend("https://example.123").valid).toBe(false);
        });
    });
});
