import { validateUsername, usernameRegex } from "./username";

describe("validateUsername — comprehensive edge cases", () => {
    it("accepts username with only numbers", () => {
        expect(validateUsername("123456").valid).toBe(true);
    });

    it("accepts username starting with a number", () => {
        expect(validateUsername("1username").valid).toBe(true);
    });

    it("accepts username with only letters", () => {
        expect(validateUsername("johndoe").valid).toBe(true);
    });

    it("accepts username with leading hyphen", () => {
        // Regex allows hyphens anywhere
        expect(validateUsername("-user").valid).toBe(false);
    });

    it("accepts username with trailing hyphen", () => {
        expect(validateUsername("user-").valid).toBe(true); // trailing hyphens pass regex
    });

    it("rejects username with space", () => {
        expect(validateUsername("john doe").valid).toBe(false);
    });

    it("rejects username with period", () => {
        expect(validateUsername("john.doe").valid).toBe(false);
    });

    it("rejects username with '@' symbol", () => {
        expect(validateUsername("@johndoe").valid).toBe(false);
    });

    it("accepts exactly 3 characters", () => {
        expect(validateUsername("abc").valid).toBe(true);
    });

    it("accepts exactly 30 characters", () => {
        expect(validateUsername("a".repeat(30)).valid).toBe(true);
    });

    it("rejects exactly 31 characters", () => {
        expect(validateUsername("a".repeat(31)).valid).toBe(false);
    });

    it("rejects exactly 2 characters", () => {
        expect(validateUsername("ab").valid).toBe(false);
    });

    it("error message mentions hyphens for invalid characters", () => {
        const result = validateUsername("john#doe");
        expect(result.valid).toBe(false);
        expect(result.error).toContain("hyphens");
    });

    it("error message mentions 3 characters for too-short input", () => {
        const result = validateUsername("ab");
        expect(result.valid).toBe(false);
        expect(result.error).toContain("3");
    });
});
