import { buildVCard } from "./buildVCard";

type User = { name: string | null; username: string | null; email: string | null; bio: string | null; image: string | null };

function makeUser(overrides: Partial<User> = {}): User {
    return { name: "Test User", username: "testuser", email: null, bio: null, image: null, ...overrides };
}

describe("buildVCard — special character escaping", () => {
    it("escapes backslash in name", () => {
        const card = buildVCard({ user: makeUser({ name: "Back\slash" }) as never, links: [] });
        expect(card).toContain("Back\\slash");
    });

    it("escapes newline in bio", () => {
        const card = buildVCard({ user: makeUser({ bio: "Line1\nLine2" }) as never, links: [] });
        expect(card).toContain("Line1\nLine2");
    });

    it("escapes Windows newline in bio", () => {
        const card = buildVCard({ user: makeUser({ bio: "Line1\r\nLine2" }) as never, links: [] });
        expect(card).toContain("Line1\nLine2");
    });

    it("escapes semicolons in bio", () => {
        const card = buildVCard({ user: makeUser({ bio: "A;B;C" }) as never, links: [] });
        expect(card).toContain("A\;B\;C");
    });

    it("escapes commas in bio", () => {
        const card = buildVCard({ user: makeUser({ bio: "A,B,C" }) as never, links: [] });
        expect(card).toContain("A\,B\,C");
    });

    it("strips newlines from image URL (sanitizeUri)", () => {
        const card = buildVCard({
            user: makeUser({ image: "https://cdn.example.com/img.jpg\n\r" }) as never,
            links: [],
        });
        const photoLine = card.split("\r\n").find((l) => l.startsWith("PHOTO"));
        expect(photoLine).toBeDefined();
        expect(photoLine).not.toContain("\n");
        expect(photoLine).not.toContain("\r");
    });

    it("uses CRLF line endings throughout", () => {
        const card = buildVCard({ user: makeUser() as never, links: [] });
        // Every line (except last) should end with \r\n
        const lines = card.split("\r\n");
        expect(lines.length).toBeGreaterThan(2);
    });

    it("handles empty bio (null) — no NOTE line", () => {
        const card = buildVCard({ user: makeUser({ bio: null }) as never, links: [] });
        expect(card).not.toContain("NOTE:");
    });
});
