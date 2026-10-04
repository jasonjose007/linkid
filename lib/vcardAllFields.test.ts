import { buildVCard } from "./buildVCard";

const CRLF = "\r\n";
type User = { name: string | null; username: string | null; email: string | null; bio: string | null; image: string | null };
type Link = { platform: string; url: string };

describe("buildVCard — all fields populated test", () => {
    const fullUser: User = {
        name: "Jane Developer",
        username: "janedev",
        email: "jane@example.com",
        bio: "Full-stack developer building cool things",
        image: "https://cdn.example.com/avatar.jpg",
    };

    const links: Link[] = [
        { platform: "github", url: "https://github.com/janedev" },
        { platform: "linkedin", url: "https://linkedin.com/in/janedev" },
    ];

    it("contains FN with full name", () => {
        const card = buildVCard({ user: fullUser as never, links: links as never });
        expect(card).toContain("FN:Jane Developer");
    });

    it("contains EMAIL field", () => {
        const card = buildVCard({ user: fullUser as never, links: links as never });
        expect(card).toContain("EMAIL;TYPE=INTERNET:jane@example.com");
    });

    it("contains NOTE with bio", () => {
        const card = buildVCard({ user: fullUser as never, links: links as never });
        expect(card).toContain("NOTE:Full-stack developer building cool things");
    });

    it("contains PHOTO with avatar URL", () => {
        const card = buildVCard({ user: fullUser as never, links: links as never });
        expect(card).toContain("PHOTO;VALUE=URI:https://cdn.example.com/avatar.jpg");
    });

    it("contains both link URLs", () => {
        const card = buildVCard({ user: fullUser as never, links: links as never });
        expect(card).toContain("https://github.com/janedev");
        expect(card).toContain("https://linkedin.com/in/janedev");
    });

    it("contains profile URL with username", () => {
        const card = buildVCard({ user: fullUser as never, links: links as never });
        const urlLines = card.split(CRLF).filter((l) => l.startsWith("URL:") && l.includes("janedev"));
        expect(urlLines).toHaveLength(1);
    });

    it("has exactly 6 CRLF-separated content lines for this input (approx)", () => {
        const card = buildVCard({ user: fullUser as never, links: links as never });
        const lines = card.split(CRLF).filter((l) => l.length > 0);
        expect(lines.length).toBeGreaterThan(8); // BEGIN, VERSION, FN, N, EMAIL, NOTE, PHOTO, 2xURL, profile URL, END
    });
});
