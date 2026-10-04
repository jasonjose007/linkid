import { isValidHttpUrl } from "./url";

describe("isValidHttpUrl — comprehensive edge cases", () => {
    describe("valid URLs", () => {
        const valid = [
            "https://example.com",
            "http://example.com",
            "https://sub.example.co.uk",
            "https://example.com/path/to/page",
            "https://example.com?q=hello+world",
            "https://example.com#fragment",
            "https://example.com:8080/api",
            "https://user:pass@example.com",
            "https://123.example.com",
            "example.com",
            "www.example.com",
        ];

        valid.forEach((url) => {
            it(`accepts: ${url}`, () => {
                expect(isValidHttpUrl(url)).toBe(true);
            });
        });
    });

    describe("invalid URLs", () => {
        const invalid = [
            "",
            "   ",
            "javascript:void(0)",
            "ftp://files.example.com",
            "://missing-scheme.com",
            "not a url at all",
        ];

        invalid.forEach((url) => {
            it(`rejects: '${url.slice(0, 30)}'`, () => {
                expect(isValidHttpUrl(url)).toBe(false);
            });
        });
    });
});
