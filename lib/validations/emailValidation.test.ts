import { signupSchema } from "./auth";

const VALID_PASSWORD = "SecurePass@123";
const VALID_NAME = "Test User";

describe("signupSchema — email validation", () => {
    function check(email: string) {
        return signupSchema.safeParse({ name: VALID_NAME, email, password: VALID_PASSWORD });
    }

    it("accepts standard email", () => {
        expect(check("user@example.com").success).toBe(true);
    });

    it("accepts email with subdomain", () => {
        expect(check("user@mail.example.com").success).toBe(true);
    });

    it("accepts email with plus sign", () => {
        expect(check("user+tag@example.com").success).toBe(true);
    });

    it("accepts email with dots in local part", () => {
        expect(check("first.last@example.com").success).toBe(true);
    });

    it("rejects email without @ symbol", () => {
        expect(check("userexample.com").success).toBe(false);
    });

    it("rejects email without domain", () => {
        expect(check("user@").success).toBe(false);
    });

    it("rejects email without TLD", () => {
        expect(check("user@example").success).toBe(false);
    });

    it("rejects empty email", () => {
        expect(check("").success).toBe(false);
    });

    it("rejects email with spaces", () => {
        expect(check("user @example.com").success).toBe(false);
    });

    it("rejects double @", () => {
        expect(check("user@@example.com").success).toBe(false);
    });

    it("accepts email with numbers", () => {
        expect(check("user123@example456.com").success).toBe(true);
    });

    it("accepts email with hyphen in domain", () => {
        expect(check("user@my-domain.com").success).toBe(true);
    });
});
