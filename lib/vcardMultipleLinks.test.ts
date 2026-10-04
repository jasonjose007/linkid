import { buildVCard } from "./buildVCard";

type User = { name: string | null; username: string | null; email: string | null; bio: string | null; image: string | null };
type Link = { platform: string; url: string };

function user(overrides: Partial<User> = {}): User {
    return { name: "Jane Dev", username: "janedev", email: "jane@example.com", bio: null, image: null, ...overrides };
}

describe("buildVCard — link handling", () => {
    it("includes no URL entries when links array is empty", () => {
        const card = buildVCard({ user: user() as never, links: [] });
        const urlLines = card.split("\r\n").filter((l) => l.startsWith("URL;TYPE="));
        expect(urlLines).toHaveLength(0);
    });

    it("includes one URL entry for a single link", () => {
        const links: Link[] = [{ platform: "github", url: "https://github.com/janedev" }];
        const card = buildVCard({ user: user() as never, links: links as never });
        const urlLines = card.split("\r\n").filter((l) => l.startsWith("URL;TYPE="));
        expect(urlLines).toHaveLength(1);
    });

    it("includes all URL entries for multiple links", () => {
        const links: Link[] = [
            { platform: "github", url: "https://github.com/janedev" },
            { platform: "linkedin", url: "https://linkedin.com/in/janedev" },
            { platform: "twitter", url: "https://twitter.com/janedev" },
        ];
        const card = buildVCard({ user: user() as never, links: links as never });
        const urlLines = card.split("\r\n").filter((l) => l.startsWith("URL;TYPE="));
        expect(urlLines).toHaveLength(3);
    });

    it("platform name is uppercased in TYPE attribute", () => {
        const links: Link[] = [{ platform: "github", url: "https://github.com/janedev" }];
        const card = buildVCard({ user: user() as never, links: links as never });
        expect(card).toContain("URL;TYPE=GITHUB:");
    });

    it("URL in link entry is correctly included", () => {
        const links: Link[] = [{ platform: "github", url: "https://github.com/janedev" }];
        const card = buildVCard({ user: user() as never, links: links as never });
        expect(card).toContain("https://github.com/janedev");
    });

    it("includes profile URL when username is set", () => {
        const card = buildVCard({ user: user({ username: "janedev" }) as never, links: [] });
        const profileLine = card.split("\r\n").find((l) => l.startsWith("URL:") && l.includes("janedev"));
        expect(profileLine).toBeDefined();
    });

    it("omits profile URL when username is null", () => {
        const card = buildVCard({ user: user({ username: null }) as never, links: [] });
        expect(card.split("\r\n").filter((l) => l.startsWith("URL:")).length).toBe(0);
    });
});
