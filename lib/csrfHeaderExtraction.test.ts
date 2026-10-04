import { CSRF_HEADER_NAME } from "./csrf";

describe("CSRF header name constant", () => {
    it("is x-csrf-token", () => {
        expect(CSRF_HEADER_NAME).toBe("x-csrf-token");
    });

    it("is lowercase (compatible with HTTP/2 header normalization)", () => {
        expect(CSRF_HEADER_NAME).toBe(CSRF_HEADER_NAME.toLowerCase());
    });
});

describe("CSRF token validation — whitespace and case sensitivity", () => {
    const { validateCsrfToken } = require("./csrf") as typeof import("./csrf");

    it("is case-sensitive: 'ABC' !== 'abc'", () => {
        expect(validateCsrfToken("ABC", "abc")).toBe(false);
    });

    it("does not trim whitespace: ' token ' !== 'token'", () => {
        expect(validateCsrfToken(" token ", "token")).toBe(false);
    });

    it("considers '00' !== '0' (length matters)", () => {
        expect(validateCsrfToken("00", "0")).toBe(false);
    });

    it("considers unicode characters correctly", () => {
        const unicode = "token\u0000abc";
        expect(validateCsrfToken(unicode, unicode)).toBe(true);
    });
});
