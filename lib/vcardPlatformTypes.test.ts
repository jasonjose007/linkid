import { buildVCard } from "./buildVCard";

type Link = { platform: string; url: string };

function user() {
    return { name: "Test User", username: "testuser", email: null, bio: null, image: null };
}

describe("buildVCard — platform TYPE attribute in URL entries", () => {
    it("platform is uppercased in TYPE", () => {
        const links: Link[] = [{ platform: "github", url: "https://github.com/test" }];
        const card = buildVCard({ user: user() as never, links: links as never });
        expect(card).toContain("URL;TYPE=GITHUB:");
    });

    it("mixed-case platform is uppercased in TYPE", () => {
        const links: Link[] = [{ platform: "LinkedIn", url: "https://linkedin.com/in/test" }];
        const card = buildVCard({ user: user() as never, links: links as never });
        expect(card).toContain("URL;TYPE=LINKEDIN:");
    });

    it("all-uppercase platform stays uppercase in TYPE", () => {
        const links: Link[] = [{ platform: "TWITTER", url: "https://twitter.com/test" }];
        const card = buildVCard({ user: user() as never, links: links as never });
        expect(card).toContain("URL;TYPE=TWITTER:");
    });

    it("URL is not sanitized for normal HTTPS links", () => {
        const links: Link[] = [{ platform: "github", url: "https://github.com/user" }];
        const card = buildVCard({ user: user() as never, links: links as never });
        expect(card).toContain("https://github.com/user");
    });

    it("newlines stripped from URL in link entry", () => {
        const links: Link[] = [{ platform: "github", url: "https://github.com/user\r\n" }];
        const card = buildVCard({ user: user() as never, links: links as never });
        const urlLines = card.split("\r\n").filter((l) => l.startsWith("URL;TYPE=GITHUB:"));
        expect(urlLines).toHaveLength(1);
        expect(urlLines[0]).not.toContain("\n");
    });

    it("5 different platform links all appear in vCard", () => {
        const platforms = ["github", "linkedin", "twitter", "youtube", "instagram"];
        const links: Link[] = platforms.map((p) => ({ platform: p, url: `https://${p}.com/test` }));
        const card = buildVCard({ user: user() as never, links: links as never });
        for (const p of platforms) {
            expect(card).toContain(`URL;TYPE=${p.toUpperCase()}:`);
        }
    });
});
