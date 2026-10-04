import { formatLabel } from "./platformHelpers";

describe("formatLabel — extended exception mappings", () => {
    it("Codeforces → 'Codeforces'", () => {
        expect(formatLabel("codeforces")).toBe("Codeforces");
    });

    it("Codechef → 'CodeChef'", () => {
        expect(formatLabel("codechef")).toBe("CodeChef");
    });

    it("Kaggle → 'Kaggle'", () => {
        expect(formatLabel("kaggle")).toBe("Kaggle");
    });

    it("GeeksforGeeks → 'GeeksforGeeks'", () => {
        expect(formatLabel("geeksforgeeks")).toBe("GeeksforGeeks");
    });

    describe("Generic capitalize fallback", () => {
        it("handles 'reddit' → 'Reddit'", () => {
            expect(formatLabel("reddit")).toBe("Reddit");
        });

        it("handles 'medium' → 'Medium'", () => {
            expect(formatLabel("medium")).toBe("Medium");
        });

        it("handles 'discord' → 'Discord'", () => {
            expect(formatLabel("discord")).toBe("Discord");
        });

        it("handles 'twitch' → 'Twitch'", () => {
            expect(formatLabel("twitch")).toBe("Twitch");
        });

        it("handles 'substack' → 'Substack'", () => {
            expect(formatLabel("substack")).toBe("Substack");
        });

        it("handles 'dribbble' → 'Dribbble'", () => {
            expect(formatLabel("dribbble")).toBe("Dribbble");
        });

        it("handles 'behance' → 'Behance'", () => {
            expect(formatLabel("behance")).toBe("Behance");
        });

        it("handles 'hashnode' → 'Hashnode'", () => {
            expect(formatLabel("hashnode")).toBe("Hashnode");
        });
    });
});
