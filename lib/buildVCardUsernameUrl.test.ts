import { buildVCard } from "./buildVCard";

describe("buildVCard — profile URL generation", () => {
    const CRLF = "\r\n";

    function user(username: string | null) {
        return { name: "Test", username, email: null, bio: null, image: null };
    }

    it("includes profile URL with base URL when username is set", () => {
        const card = buildVCard({ user: user("johndoe") as never, links: [] });
        expect(card).toContain("johndoe");
        const urlLines = card.split(CRLF).filter((l) => l.startsWith("URL:"));
        expect(urlLines).toHaveLength(1);
    });

    it("omits profile URL when username is null", () => {
        const card = buildVCard({ user: user(null) as never, links: [] });
        const urlLines = card.split(CRLF).filter((l) => l.startsWith("URL:"));
        expect(urlLines).toHaveLength(0);
    });

    it("strips trailing slash from base URL in profile link", () => {
        const card = buildVCard({ user: user("alice") as never, links: [] });
        const urlLine = card.split(CRLF).find((l) => l.startsWith("URL:"));
        // Should not have double slash before username
        expect(urlLine).not.toContain("//alice");
    });

    it("profile URL does not contain newlines (URI sanitized)", () => {
        const card = buildVCard({ user: user("test\nuser") as never, links: [] });
        const urlLine = card.split(CRLF).find((l) => l.startsWith("URL:"));
        if (urlLine) {
            expect(urlLine).not.toContain("\n");
        }
    });

    it("FN is set even when only username (no name) is provided", () => {
        const card = buildVCard({ user: { name: null, username: "jdoe", email: null, bio: null, image: null } as never, links: [] });
        expect(card).toContain("FN:jdoe");
    });

    it("produces valid vCard when all optional fields are null", () => {
        const card = buildVCard({ user: { name: "Min User", username: null, email: null, bio: null, image: null } as never, links: [] });
        expect(card).toContain("BEGIN:VCARD");
        expect(card).toContain("END:VCARD");
    });
});
