import { validatePlatformUrl, detectPlatform } from "./platforms";

describe("StackOverflow and developer platform URL tests", () => {
    describe("StackOverflow validation", () => {
        it("accepts SO profile with numeric ID", () => {
            expect(validatePlatformUrl("stackoverflow", "https://stackoverflow.com/users/123456/username")).toBe(true);
        });

        it("accepts SO profile without username suffix", () => {
            expect(validatePlatformUrl("stackoverflow", "https://stackoverflow.com/users/123456")).toBe(true);
        });

        it("rejects non-user SO URL (questions)", () => {
            expect(validatePlatformUrl("stackoverflow", "https://stackoverflow.com/questions/123")).toBe(false);
        });
    });

    describe("GitLab validation", () => {
        it("accepts GitLab profile", () => {
            expect(validatePlatformUrl("gitlab", "https://gitlab.com/username")).toBe(true);
        });

        it("rejects GitHub URL for gitlab platform", () => {
            expect(validatePlatformUrl("gitlab", "https://github.com/username")).toBe(false);
        });
    });

    describe("Dev.to validation", () => {
        it("accepts dev.to profile", () => {
            expect(validatePlatformUrl("devto", "https://dev.to/username")).toBe(true);
        });

        it("rejects Medium URL for devto platform", () => {
            expect(validatePlatformUrl("devto", "https://medium.com/@username")).toBe(false);
        });
    });

    describe("Hashnode validation", () => {
        it("accepts hashnode.com profile", () => {
            expect(validatePlatformUrl("hashnode", "https://hashnode.com/@username")).toBe(true);
        });
    });

    describe("CodeChef and Codeforces", () => {
        it("detects Codeforces URL", () => {
            expect(detectPlatform("https://codeforces.com/profile/user")).toBe("codeforces");
        });

        it("detects Codechef URL", () => {
            expect(detectPlatform("https://www.codechef.com/users/username")).toBe("codechef");
        });
    });
});
