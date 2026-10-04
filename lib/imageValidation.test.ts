import { hasSupportedImageMagicBytes } from "./imageValidation";

function makeBuffer(bytes: number[]): Buffer {
    const buf = Buffer.alloc(12, 0);
    bytes.forEach((b, i) => { buf[i] = b; });
    return buf;
}

describe("hasSupportedImageMagicBytes", () => {
    it("accepts a valid JPEG buffer (FF D8 FF ...)", () => {
        const buf = makeBuffer([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0]);
        expect(hasSupportedImageMagicBytes(buf)).toBe(true);
    });

    it("accepts a valid PNG buffer (89 50 4E 47 ...)", () => {
        const buf = makeBuffer([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
        expect(hasSupportedImageMagicBytes(buf)).toBe(true);
    });

    it("accepts a valid WebP buffer (RIFF....WEBP)", () => {
        const buf = makeBuffer([
            0x52, 0x49, 0x46, 0x46, // RIFF
            0x00, 0x00, 0x00, 0x00, // file size (ignored)
            0x57, 0x45, 0x42, 0x50, // WEBP
        ]);
        expect(hasSupportedImageMagicBytes(buf)).toBe(true);
    });

    it("rejects a buffer shorter than 12 bytes", () => {
        const buf = Buffer.alloc(8, 0);
        expect(hasSupportedImageMagicBytes(buf)).toBe(false);
    });

    it("rejects a buffer with all zeros", () => {
        const buf = Buffer.alloc(12, 0);
        expect(hasSupportedImageMagicBytes(buf)).toBe(false);
    });

    it("rejects an SVG-like buffer (starts with '<')", () => {
        const buf = makeBuffer([0x3c, 0x73, 0x76, 0x67, 0, 0, 0, 0, 0, 0, 0, 0]);
        expect(hasSupportedImageMagicBytes(buf)).toBe(false);
    });

    it("rejects a PDF buffer (%PDF)", () => {
        const buf = makeBuffer([0x25, 0x50, 0x44, 0x46, 0, 0, 0, 0, 0, 0, 0, 0]);
        expect(hasSupportedImageMagicBytes(buf)).toBe(false);
    });

    it("rejects a GIF buffer (GIF89a)", () => {
        const buf = makeBuffer([0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0, 0, 0, 0, 0, 0]);
        expect(hasSupportedImageMagicBytes(buf)).toBe(false);
    });
});
