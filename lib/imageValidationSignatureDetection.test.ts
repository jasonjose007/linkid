import { hasSupportedImageMagicBytes } from "./imageValidation";

describe("hasSupportedImageMagicBytes — signature detection accuracy", () => {
    function makeJpegBuffer(): Buffer {
        const buf = Buffer.alloc(12, 0);
        buf[0] = 0xff; buf[1] = 0xd8; buf[2] = 0xff; buf[3] = 0xe0;
        return buf;
    }

    function makePngBuffer(): Buffer {
        const buf = Buffer.alloc(12, 0);
        buf[0] = 0x89; buf[1] = 0x50; buf[2] = 0x4e; buf[3] = 0x47;
        buf[4] = 0x0d; buf[5] = 0x0a; buf[6] = 0x1a; buf[7] = 0x0a;
        return buf;
    }

    function makeWebpBuffer(): Buffer {
        const buf = Buffer.alloc(12, 0);
        buf[0] = 0x52; buf[1] = 0x49; buf[2] = 0x46; buf[3] = 0x46; // RIFF
        buf[4] = 0x10; buf[5] = 0x00; buf[6] = 0x00; buf[7] = 0x00; // file size
        buf[8] = 0x57; buf[9] = 0x45; buf[10] = 0x42; buf[11] = 0x50; // WEBP
        return buf;
    }

    it("correctly identifies JPEG", () => {
        expect(hasSupportedImageMagicBytes(makeJpegBuffer())).toBe(true);
    });

    it("correctly identifies PNG", () => {
        expect(hasSupportedImageMagicBytes(makePngBuffer())).toBe(true);
    });

    it("correctly identifies WebP", () => {
        expect(hasSupportedImageMagicBytes(makeWebpBuffer())).toBe(true);
    });

    it("JPEG with only 2 bytes → false (too short)", () => {
        expect(hasSupportedImageMagicBytes(Buffer.from([0xff, 0xd8]))).toBe(false);
    });

    it("PNG with only 3 bytes → false (too short)", () => {
        expect(hasSupportedImageMagicBytes(Buffer.from([0x89, 0x50, 0x4e]))).toBe(false);
    });

    it("RIFF without WEBP → false (WAV file)", () => {
        const buf = Buffer.alloc(12, 0);
        buf[0] = 0x52; buf[1] = 0x49; buf[2] = 0x46; buf[3] = 0x46; // RIFF
        buf[8] = 0x57; buf[9] = 0x41; buf[10] = 0x56; buf[11] = 0x45; // WAVE
        expect(hasSupportedImageMagicBytes(buf)).toBe(false);
    });
});
