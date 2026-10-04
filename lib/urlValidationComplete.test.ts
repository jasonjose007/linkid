import { validateUrl, validateUrlBackend, isSafeRedirectUrl } from "./urlValidation";

describe("URL validation — comprehensive combined tests", () => {
    const VALID_URLS = [
        "https://linktr.ee/username",
        "https://bento.me/username",
        "https://linkinbio.com/u/handle",
        "https://carrd.co",
        "https://notion.so/page-id",
        "https://my-personal-blog.com/posts/2026",
    ];

    const SSRF_URLS = [
        "http://169.254.169.254/latest/meta-data/",  // AWS IMDS
        "http://127.0.0.1:8080",
        "http://localhost",
        "http://0.0.0.0",
        "http://[::1]/admin",
    ];

    VALID_URLS.forEach((url) => {
        it(`validateUrl accepts: ${url}`, () => {
            expect(validateUrl(url).valid).toBe(true);
        });
    });

    SSRF_URLS.forEach((url) => {
        it(`validateUrlBackend blocks SSRF: ${url}`, () => {
            expect(validateUrlBackend(url).valid).toBe(false);
        });
    });

    it("isSafeRedirectUrl accepts https linktree", () => {
        expect(isSafeRedirectUrl("https://linktr.ee/username")).toBe(true);
    });

    it("isSafeRedirectUrl rejects any non-http scheme", () => {
        expect(isSafeRedirectUrl("mailto:test@example.com")).toBe(false);
    });
});
