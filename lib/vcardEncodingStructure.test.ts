import { buildVCard } from "./buildVCard";

describe("buildVCard — vCard 3.0 structure compliance", () => {
    const CRLF = "\r\n";

    function user() {
        return { name: "Test User", username: "testuser", email: "test@example.com", bio: "Developer", image: null };
    }

    it("uses CRLF (\r\n) as line separator", () => {
        const card = buildVCard({ user: user() as never, links: [] });
        // Should have CRLF separators
        expect(card).toContain(CRLF);
    });

    it("VERSION:3.0 appears before other fields", () => {
        const card = buildVCard({ user: user() as never, links: [] });
        const versionIdx = card.indexOf("VERSION:3.0");
        const fnIdx = card.indexOf("FN:");
        expect(versionIdx).toBeLessThan(fnIdx);
    });

    it("ends with END:VCARD followed by CRLF", () => {
        const card = buildVCard({ user: user() as never, links: [] });
        expect(card.endsWith(`END:VCARD${CRLF}`)).toBe(true);
    });

    it("no double CRLF in middle of card (no blank lines)", () => {
        const card = buildVCard({ user: user() as never, links: [] });
        expect(card).not.toContain(CRLF + CRLF);
    });

    it("each property on its own line", () => {
        const card = buildVCard({ user: user() as never, links: [] });
        const lines = card.split(CRLF).filter((l) => l.length > 0);
        expect(lines.length).toBeGreaterThan(3);
    });

    it("contains exactly one BEGIN:VCARD", () => {
        const card = buildVCard({ user: user() as never, links: [] });
        const count = (card.match(/BEGIN:VCARD/g) || []).length;
        expect(count).toBe(1);
    });

    it("contains exactly one END:VCARD", () => {
        const card = buildVCard({ user: user() as never, links: [] });
        const count = (card.match(/END:VCARD/g) || []).length;
        expect(count).toBe(1);
    });
});
