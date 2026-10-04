import { hasSupportedImageMagicBytes } from "./imageValidation";

describe("hasSupportedImageMagicBytes — extended tests", () => {
    function buf(bytes: number[]): Buffer {
        const b = Buffer.alloc(Math.max(12, bytes.length), 0);
        bytes.forEach((v, i) => { b[i] = v; });
        return b;
    }

    describe("JPEG variants", () => {
        it("accepts JFIF JPEG (FF D8 FF E0)", () => {
            expect(hasSupportedImageMagicBytes(buf([0xff, 0xd8, 0xff, 0xe0]))).toBe(true);
        });

        it("accepts Exif JPEG (FF D8 FF E1)", () => {
            expect(hasSupportedImageMagicBytes(buf([0xff, 0xd8, 0xff, 0xe1]))).toBe(true);
        });

        it("accepts any FF D8 FF xx", () => {
            expect(hasSupportedImageMagicBytes(buf([0xff, 0xd8, 0xff, 0xfe]))).toBe(true);
        });
    });

    describe("PNG detection", () => {
        it("correctly identifies PNG magic signature", () => {
            // Full PNG signature: 89 50 4E 47 0D 0A 1A 0A
            expect(hasSupportedImageMagicBytes(buf([
                0x89, 0x50, 0x4e, 0x47,
                0x0d, 0x0a, 0x1a, 0x0a,
                0, 0, 0, 0,
            ]))).toBe(true);
        });
    });

    describe("WebP detection", () => {
        it("accepts WebP with non-zero file size bytes", () => {
            expect(hasSupportedImageMagicBytes(buf([
                0x52, 0x49, 0x46, 0x46, // RIFF
                0xac, 0x8e, 0x01, 0x00, // file size (arbitrary)
                0x57, 0x45, 0x42, 0x50, // WEBP
            ]))).toBe(true);
        });

        it("rejects RIFF without WEBP marker", () => {
            expect(hasSupportedImageMagicBytes(buf([
                0x52, 0x49, 0x46, 0x46, // RIFF
                0x00, 0x00, 0x00, 0x00,
                0x41, 0x56, 0x49, 0x20, // AVI  (not WEBP)
            ]))).toBe(false);
        });
    });

    describe("Buffer length edge cases", () => {
        it("rejects buffer of exactly 11 bytes", () => {
            const b = Buffer.alloc(11, 0xff);
            expect(hasSupportedImageMagicBytes(b)).toBe(false);
        });

        it("accepts buffer of exactly 12 bytes when it's JPEG", () => {
            const b = Buffer.alloc(12, 0);
            b[0] = 0xff; b[1] = 0xd8; b[2] = 0xff; b[3] = 0xe0;
            expect(hasSupportedImageMagicBytes(b)).toBe(true);
        });
    });
});
