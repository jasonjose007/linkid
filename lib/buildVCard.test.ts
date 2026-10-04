import { buildVCard } from "./buildVCard";

const CRLF = "\r\n";

type MockUser = {
    username: string | null;
    name: string | null;
    email: string | null;
    bio: string | null;
    image: string | null;
};

type MockLink = { platform: string; url: string };

function makeUser(overrides: Partial<MockUser> = {}): MockUser {
    return {
        username: "testuser",
        name: "Test User",
        email: "test@example.com",
        bio: "Developer",
        image: "https://cdn.example.com/avatar.png",
        ...overrides,
    };
}

describe("buildVCard", () => {
    it("begins with BEGIN:VCARD and ends with END:VCARD", () => {
        const card = buildVCard({ user: makeUser() as never, links: [] });
        expect(card.startsWith("BEGIN:VCARD")).toBe(true);
        expect(card.trimEnd().endsWith("END:VCARD" + CRLF)).toBe(true);
    });

    it("includes VERSION:3.0", () => {
        const card = buildVCard({ user: makeUser() as never, links: [] });
        expect(card).toContain("VERSION:3.0");
    });

    it("includes FN with the user name", () => {
        const card = buildVCard({ user: makeUser({ name: "Jane Doe" }) as never, links: [] });
        expect(card).toContain("FN:Jane Doe");
    });

    it("falls back to username when name is null", () => {
        const card = buildVCard({ user: makeUser({ name: null, username: "jdoe" }) as never, links: [] });
        expect(card).toContain("FN:jdoe");
    });

    it("includes EMAIL when email is set", () => {
        const card = buildVCard({ user: makeUser() as never, links: [] });
        expect(card).toContain("EMAIL;TYPE=INTERNET:test@example.com");
    });

    it("omits EMAIL when email is null", () => {
        const card = buildVCard({ user: makeUser({ email: null }) as never, links: [] });
        expect(card).not.toContain("EMAIL;TYPE=INTERNET");
    });

    it("includes NOTE for bio", () => {
        const card = buildVCard({ user: makeUser({ bio: "My bio" }) as never, links: [] });
        expect(card).toContain("NOTE:My bio");
    });

    it("includes PHOTO for image URL", () => {
        const card = buildVCard({ user: makeUser() as never, links: [] });
        expect(card).toContain("PHOTO;VALUE=URI:https://cdn.example.com/avatar.png");
    });

    it("includes URL entries for each link", () => {
        const links: MockLink[] = [
            { platform: "github", url: "https://github.com/testuser" },
            { platform: "linkedin", url: "https://linkedin.com/in/testuser" },
        ];
        const card = buildVCard({ user: makeUser() as never, links: links as never });
        expect(card).toContain("URL;TYPE=GITHUB:https://github.com/testuser");
        expect(card).toContain("URL;TYPE=LINKEDIN:https://linkedin.com/in/testuser");
    });

    it("escapes semicolons in name", () => {
        const card = buildVCard({ user: makeUser({ name: "John;Doe" }) as never, links: [] });
        expect(card).toContain("FN:John\;Doe");
    });

    it("escapes commas in bio", () => {
        const card = buildVCard({ user: makeUser({ bio: "Dev, Engineer" }) as never, links: [] });
        expect(card).toContain("NOTE:Dev\, Engineer");
    });

    it("strips newlines from image URL", () => {
        const card = buildVCard({
            user: makeUser({ image: "https://cdn.example.com/img.png\n" }) as never,
            links: [],
        });
        expect(card).not.toContain("\n\n");
    });
});
