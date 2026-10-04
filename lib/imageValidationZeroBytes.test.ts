import { hasSupportedImageMagicBytes } from "./imageValidation";

describe("hasSupportedImageMagicBytes — zero-filled and random buffer tests", () => {
    it("all-zeros 12-byte buffer is rejected", () => {
        expect(hasSupportedImageMagicBytes(Buffer.alloc(12, 0))).toBe(false);
    });

    it("all-0xFF 12-byte buffer is rejected (not a valid signature)", () => {
        expect(hasSupportedImageMagicBytes(Buffer.alloc(12, 0xff))).toBe(false);
    });

    it("random-looking bytes without valid signature are rejected", () => {
        const buf = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c]);
        expect(hasSupportedImageMagicBytes(buf)).toBe(false);
    });

    it("text/HTML file signature '<HTM' is rejected", () => {
        const buf = Buffer.from([0x3c, 0x48, 0x54, 0x4d, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
        expect(hasSupportedImageMagicBytes(buf)).toBe(false);
    });

    it("ZIP file signature PK is rejected", () => {
        const buf = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
        expect(hasSupportedImageMagicBytes(buf)).toBe(false);
    });

    it("exact 12-byte JPEG is accepted", () => {
        const buf = Buffer.alloc(12, 0);
        buf[0] = 0xff; buf[1] = 0xd8; buf[2] = 0xff;
        expect(hasSupportedImageMagicBytes(buf)).toBe(true);
    });

    it("large buffer (1000 bytes) with JPEG magic → accepted", () => {
        const buf = Buffer.alloc(1000, 0);
        buf[0] = 0xff; buf[1] = 0xd8; buf[2] = 0xff; buf[3] = 0xe0;
        expect(hasSupportedImageMagicBytes(buf)).toBe(true);
    });

    it("large buffer with PNG magic → accepted", () => {
        const buf = Buffer.alloc(1000, 0);
        buf[0] = 0x89; buf[1] = 0x50; buf[2] = 0x4e; buf[3] = 0x47;
        buf[4] = 0x0d; buf[5] = 0x0a; buf[6] = 0x1a; buf[7] = 0x0a;
        expect(hasSupportedImageMagicBytes(buf)).toBe(true);
    });
});
