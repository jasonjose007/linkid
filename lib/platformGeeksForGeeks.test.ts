import { validatePlatformUrl, detectPlatform, formatLabel } from "./platforms";
import { formatLabel as formatLabelHelper } from "./platformHelpers";

describe("GeeksForGeeks and competitive programming platforms", () => {
    describe("GeeksForGeeks URL validation", () => {
        it("accepts GeeksForGeeks profile URL", () => {
            expect(validatePlatformUrl("geeksforgeeks", "https://www.geeksforgeeks.org/user/username")).toBe(true);
        });
    });

    describe("Kaggle URL validation", () => {
        it("accepts Kaggle profile", () => {
            expect(validatePlatformUrl("kaggle", "https://kaggle.com/username")).toBe(true);
        });

        it("accepts Kaggle with www prefix", () => {
            expect(validatePlatformUrl("kaggle", "https://www.kaggle.com/username")).toBe(true);
        });
    });

    describe("Codeforces URL detection", () => {
        it("detects Codeforces profile URL", () => {
            expect(detectPlatform("https://codeforces.com/profile/username")).toBe("codeforces");
        });
    });

    describe("CodeChef URL detection", () => {
        it("detects CodeChef profile URL", () => {
            expect(detectPlatform("https://www.codechef.com/users/username")).toBe("codechef");
        });
    });

    describe("Platform label formatting for coding platforms", () => {
        it("formatLabel: geeksforgeeks → GeeksforGeeks", () => {
            expect(formatLabelHelper("geeksforgeeks")).toBe("GeeksforGeeks");
        });

        it("formatLabel: codechef → CodeChef", () => {
            expect(formatLabelHelper("codechef")).toBe("CodeChef");
        });

        it("formatLabel: codeforces → Codeforces", () => {
            expect(formatLabelHelper("codeforces")).toBe("Codeforces");
        });

        it("formatLabel: kaggle → Kaggle", () => {
            expect(formatLabelHelper("kaggle")).toBe("Kaggle");
        });
    });
});
