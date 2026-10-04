import { signupSchema } from "./auth";

const BASE = { email: "test@example.com", password: "SecurePass@123" };

describe("signupSchema — name field validation", () => {
    it("accepts 2-character name", () => {
        expect(signupSchema.safeParse({ ...BASE, name: "Jo" }).success).toBe(true);
    });

    it("accepts long name", () => {
        expect(signupSchema.safeParse({ ...BASE, name: "A".repeat(50) }).success).toBe(true);
    });

    it("accepts name with spaces", () => {
        expect(signupSchema.safeParse({ ...BASE, name: "John Doe" }).success).toBe(true);
    });

    it("accepts name with Unicode characters", () => {
        expect(signupSchema.safeParse({ ...BASE, name: "José García" }).success).toBe(true);
    });

    it("rejects 1-character name", () => {
        const result = signupSchema.safeParse({ ...BASE, name: "A" });
        expect(result.success).toBe(false);
    });

    it("rejects empty name", () => {
        expect(signupSchema.safeParse({ ...BASE, name: "" }).success).toBe(false);
    });

    it("rejects undefined name (missing field)", () => {
        const { name: _, ...withoutName } = { ...BASE, name: "" };
        expect(signupSchema.safeParse(withoutName).success).toBe(false);
    });

    it("error message mentions name requirement", () => {
        const result = signupSchema.safeParse({ ...BASE, name: "X" });
        expect(result.success).toBe(false);
        if (!result.success) {
            const hasNameError = result.error.issues.some((i) => i.path.includes("name"));
            expect(hasNameError).toBe(true);
        }
    });

    it("accepts name with numbers", () => {
        expect(signupSchema.safeParse({ ...BASE, name: "John123" }).success).toBe(true);
    });

    it("accepts name with hyphens", () => {
        expect(signupSchema.safeParse({ ...BASE, name: "Mary-Jane" }).success).toBe(true);
    });
});
