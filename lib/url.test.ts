import { isValidHttpUrl } from "./url";

describe("isValidHttpUrl", () => {
    it("accepts a valid https URL", () => {
        expect(isValidHttpUrl("https://example.com")).toBe(true);
    });

    it("accepts a valid http URL", () => {
        expect(isValidHttpUrl("http://example.com")).toBe(true);
    });

    it("accepts URL without scheme (prepends https)", () => {
        expect(isValidHttpUrl("example.com")).toBe(true);
    });

    it("accepts URL with path and query", () => {
        expect(isValidHttpUrl("https://example.com/path?q=1")).toBe(true);
    });

    it("rejects ftp scheme", () => {
        expect(isValidHttpUrl("ftp://example.com")).toBe(false);
    });

    it("rejects javascript scheme", () => {
        expect(isValidHttpUrl("javascript:alert(1)")).toBe(false);
    });

    it("rejects empty string", () => {
        expect(isValidHttpUrl("")).toBe(false);
    });

    it("rejects plain text with no domain", () => {
        expect(isValidHttpUrl("not a url")).toBe(false);
    });

    it("accepts subdomain URLs", () => {
        expect(isValidHttpUrl("https://api.example.com")).toBe(true);
    });

    it("accepts URL with port number", () => {
        expect(isValidHttpUrl("https://example.com:8080")).toBe(true);
    });
});
