import { validateUsername, usernameRegex } from "./username";

describe("usernameRegex", () => {
    it("accepts alphanumeric usernames", () => {
        expect(usernameRegex.test("john123")).toBe(true);
    });

    it("accepts usernames with hyphens", () => {
        expect(usernameRegex.test("john-doe")).toBe(true);
    });

    it("rejects usernames with underscores", () => {
        expect(usernameRegex.test("john_doe")).toBe(false);
    });

    it("rejects usernames with spaces", () => {
        expect(usernameRegex.test("john doe")).toBe(false);
    });

    it("rejects usernames with special characters", () => {
        expect(usernameRegex.test("john@doe")).toBe(false);
    });
});

describe("validateUsername", () => {
    it("accepts a valid username", () => {
        expect(validateUsername("johndoe").valid).toBe(true);
    });

    it("accepts username with hyphen", () => {
        expect(validateUsername("john-doe").valid).toBe(true);
    });

    it("rejects empty string", () => {
        const result = validateUsername("");
        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();
    });

    it("rejects whitespace-only input", () => {
        expect(validateUsername("   ").valid).toBe(false);
    });

    it("rejects username shorter than 3 characters", () => {
        const result = validateUsername("ab");
        expect(result.valid).toBe(false);
        expect(result.error).toContain("3 characters");
    });

    it("rejects username longer than 30 characters", () => {
        const result = validateUsername("a".repeat(31));
        expect(result.valid).toBe(false);
        expect(result.error).toContain("30 characters");
    });

    it("rejects username with special characters", () => {
        const result = validateUsername("john@doe!");
        expect(result.valid).toBe(false);
        expect(result.error).toContain("hyphens");
    });

    it("accepts exactly 3 character username", () => {
        expect(validateUsername("abc").valid).toBe(true);
    });

    it("accepts exactly 30 character username", () => {
        expect(validateUsername("a".repeat(30)).valid).toBe(true);
    });
});
