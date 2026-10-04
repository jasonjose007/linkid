import { isValidHttpUrl } from "./url";

describe("isValidHttpUrl — scheme and protocol tests", () => {
    describe("HTTP and HTTPS (valid)", () => {
        it("https:// is valid", () => expect(isValidHttpUrl("https://example.com")).toBe(true));
        it("http:// is valid", () => expect(isValidHttpUrl("http://example.com")).toBe(true));
        it("HTTPS:// uppercase is valid (case-insensitive)", () => {
            // URL constructor normalizes scheme to lowercase
            expect(isValidHttpUrl("HTTPS://example.com")).toBe(true);
        });
    });

    describe("Non-http/https schemes (invalid)", () => {
        const schemes = [
            "ftp://", "sftp://", "ssh://", "data:", "javascript:",
            "file:///", "blob:", "about:", "chrome://", "mailto:",
        ];

        schemes.forEach((scheme) => {
            it(`rejects: ${scheme}`, () => {
                expect(isValidHttpUrl(`${scheme}example.com`)).toBe(false);
            });
        });
    });

    describe("URL without scheme (valid — infers https)", () => {
        it("example.com infers https", () => expect(isValidHttpUrl("example.com")).toBe(true));
        it("subdomain.example.com is valid", () => expect(isValidHttpUrl("subdomain.example.com")).toBe(true));
        it("example.co.uk is valid", () => expect(isValidHttpUrl("example.co.uk")).toBe(true));
    });
});
