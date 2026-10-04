import { formatLabel } from "./platformHelpers";

describe("formatLabel — complete exception coverage", () => {
    const EXCEPTIONS: Record<string, string> = {
        github: "GitHub",
        linkedin: "LinkedIn",
        x: "X (Twitter)",
        youtube: "YouTube",
        leetcode: "LeetCode",
        devto: "Dev.to",
        codeforces: "Codeforces",
        codechef: "CodeChef",
        kaggle: "Kaggle",
        geeksforgeeks: "GeeksforGeeks",
    };

    Object.entries(EXCEPTIONS).forEach(([key, expected]) => {
        it(`formatLabel("${key}") === "${expected}"`, () => {
            expect(formatLabel(key)).toBe(expected);
        });
    });

    it("all exception labels are non-empty", () => {
        for (const key of Object.keys(EXCEPTIONS)) {
            expect(formatLabel(key).length).toBeGreaterThan(0);
        }
    });

    it("exception count is 10", () => {
        expect(Object.keys(EXCEPTIONS)).toHaveLength(10);
    });

    describe("Generic fallback for non-exception platforms", () => {
        it("facebook → Facebook", () => expect(formatLabel("facebook")).toBe("Facebook"));
        it("instagram → Instagram", () => expect(formatLabel("instagram")).toBe("Instagram"));
        it("twitter → Twitter", () => expect(formatLabel("twitter")).toBe("Twitter"));
        it("reddit → Reddit", () => expect(formatLabel("reddit")).toBe("Reddit"));
        it("medium → Medium", () => expect(formatLabel("medium")).toBe("Medium"));
        it("discord → Discord", () => expect(formatLabel("discord")).toBe("Discord"));
        it("twitch → Twitch", () => expect(formatLabel("twitch")).toBe("Twitch"));
        it("substack → Substack", () => expect(formatLabel("substack")).toBe("Substack"));
        it("hashnode → Hashnode", () => expect(formatLabel("hashnode")).toBe("Hashnode"));
    });
});
