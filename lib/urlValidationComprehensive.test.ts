import { validateUrl, validateUrlBackend, isSafeRedirectUrl } from "./urlValidation";

describe("validateUrl — comprehensive valid URL patterns", () => {
    const validUrls = [
        "https://example.com",
        "http://example.com",
        "https://sub.example.com/path",
        "https://example.io",
        "https://example.co.uk",
        "https://example.com:8080",
        "https://example.com?key=value",
        "https://user:pass@example.com",
        "example.com",
        "www.example.com",
    ];

    validUrls.forEach((url) => {
        it(`accepts: ${url}`, () => {
            expect(validateUrl(url).valid).toBe(true);
        });
    });

    it("error object has error message for invalid URL", () => {
        const result = validateUrl("");
        expect(result.valid).toBe(false);
        if (!result.valid) {
            expect(result.error).toBeTruthy();
        }
    });
});

describe("validateUrlBackend — security validation chain", () => {
    it("accepts normal HTTPS URL end-to-end", () => {
        const result = validateUrlBackend("https://vishnukothakapu.com");
        expect(result.valid).toBe(true);
    });

    it("normalizes and accepts URL without scheme", () => {
        const result = validateUrlBackend("vishnukothakapu.com");
        expect(result.valid).toBe(true);
        if (result.valid) {
            expect(result.normalizedUrl.startsWith("https://")).toBe(true);
        }
    });

    it("result has normalizedUrl on success", () => {
        const result = validateUrlBackend("https://example.com");
        expect(result.valid).toBe(true);
        if (result.valid) {
            expect(result.normalizedUrl).toBe("https://example.com");
        }
    });

    it("result has error string on failure", () => {
        const result = validateUrlBackend("not valid");
        expect(result.valid).toBe(false);
        if (!result.valid) {
            expect(result.error).toBeTruthy();
        }
    });
});
