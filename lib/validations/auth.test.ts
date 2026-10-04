import { signupSchema } from "./auth";

describe("signupSchema", () => {
    const validData = {
        name: "John Doe",
        email: "john@example.com",
        password: "Secure@123",
    };

    it("accepts valid signup data", () => {
        expect(signupSchema.safeParse(validData).success).toBe(true);
    });

    it("rejects name shorter than 2 characters", () => {
        const result = signupSchema.safeParse({ ...validData, name: "J" });
        expect(result.success).toBe(false);
    });

    it("rejects invalid email format", () => {
        const result = signupSchema.safeParse({ ...validData, email: "notanemail" });
        expect(result.success).toBe(false);
    });

    it("rejects password shorter than 8 characters", () => {
        const result = signupSchema.safeParse({ ...validData, password: "Ab@1" });
        expect(result.success).toBe(false);
    });

    it("rejects password without uppercase letter", () => {
        const result = signupSchema.safeParse({ ...validData, password: "secure@123" });
        expect(result.success).toBe(false);
    });

    it("rejects password without lowercase letter", () => {
        const result = signupSchema.safeParse({ ...validData, password: "SECURE@123" });
        expect(result.success).toBe(false);
    });

    it("rejects password without numeric digit", () => {
        const result = signupSchema.safeParse({ ...validData, password: "Secure@abc" });
        expect(result.success).toBe(false);
    });

    it("rejects password without special character", () => {
        const result = signupSchema.safeParse({ ...validData, password: "Secure1234" });
        expect(result.success).toBe(false);
    });

    it("rejects missing name", () => {
        const { name: _, ...rest } = validData;
        expect(signupSchema.safeParse(rest).success).toBe(false);
    });

    it("rejects missing email", () => {
        const { email: _, ...rest } = validData;
        expect(signupSchema.safeParse(rest).success).toBe(false);
    });

    it("accepts password with all required character types", () => {
        const result = signupSchema.safeParse({ ...validData, password: "MyPass@99!" });
        expect(result.success).toBe(true);
    });
});
