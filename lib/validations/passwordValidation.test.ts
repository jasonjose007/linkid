import { signupSchema } from "./auth";

describe("Password policy — comprehensive validation", () => {
    const BASE = { name: "Test User", email: "test@example.com" };

    it("accepts a strong password meeting all requirements", () => {
        expect(signupSchema.safeParse({ ...BASE, password: "MyStr0ng@Pass!" }).success).toBe(true);
    });

    it("rejects password with exactly 7 characters", () => {
        expect(signupSchema.safeParse({ ...BASE, password: "Ab@1xyz" }).success).toBe(false);
    });

    it("accepts password with exactly 8 characters", () => {
        expect(signupSchema.safeParse({ ...BASE, password: "Ab@12345" }).success).toBe(true);
    });

    it("accepts password with 100 characters", () => {
        const long = "Aa1!" + "x".repeat(96);
        expect(signupSchema.safeParse({ ...BASE, password: long }).success).toBe(true);
    });

    it("rejects password without uppercase — with correct error message", () => {
        const result = signupSchema.safeParse({ ...BASE, password: "mystr0ng@pass" });
        expect(result.success).toBe(false);
        if (!result.success) {
            const messages = result.error.issues.map((i) => i.message);
            expect(messages.some((m) => m.toLowerCase().includes("uppercase"))).toBe(true);
        }
    });

    it("rejects password without lowercase — with correct error message", () => {
        const result = signupSchema.safeParse({ ...BASE, password: "MYSTR0NG@PASS" });
        expect(result.success).toBe(false);
        if (!result.success) {
            const messages = result.error.issues.map((i) => i.message);
            expect(messages.some((m) => m.toLowerCase().includes("lowercase"))).toBe(true);
        }
    });

    it("rejects password without number — with correct error message", () => {
        const result = signupSchema.safeParse({ ...BASE, password: "MyStrong@Pass" });
        expect(result.success).toBe(false);
        if (!result.success) {
            const messages = result.error.issues.map((i) => i.message);
            expect(messages.some((m) => m.toLowerCase().includes("number"))).toBe(true);
        }
    });

    it("rejects password without special character — with correct error message", () => {
        const result = signupSchema.safeParse({ ...BASE, password: "MyStr0ngPass" });
        expect(result.success).toBe(false);
        if (!result.success) {
            const messages = result.error.issues.map((i) => i.message);
            expect(messages.some((m) => m.toLowerCase().includes("special"))).toBe(true);
        }
    });

    it("accepts various special characters", () => {
        const specials = ["!", "@", "#", "$", "%", "^", "&", "*"];
        for (const s of specials) {
            expect(signupSchema.safeParse({ ...BASE, password: `Abc123${s}` }).success).toBe(true);
        }
    });
});
