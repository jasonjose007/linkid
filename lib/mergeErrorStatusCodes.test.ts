import { MergeError } from "./accountMerge";

describe("MergeError — HTTP status code semantics", () => {
    it("400 Bad Request — missing required fields", () => {
        const err = new MergeError("Password confirmation is required", 400);
        expect(err.status).toBe(400);
        expect(err.message).toContain("required");
    });

    it("401 Unauthorized — wrong password", () => {
        const err = new MergeError("Password confirmation failed", 401);
        expect(err.status).toBe(401);
        expect(err.message).toContain("failed");
    });

    it("401 Unauthorized — wrong email", () => {
        const err = new MergeError("Email confirmation did not match", 401);
        expect(err.status).toBe(401);
    });

    it("400 Bad Request — cannot verify account", () => {
        const err = new MergeError("This account cannot be verified for merge", 400);
        expect(err.status).toBe(400);
    });

    it("instanceof check works in catch block", () => {
        let caught: unknown = null;
        try {
            throw new MergeError("test error", 422);
        } catch (e) {
            caught = e;
        }
        expect(caught).toBeInstanceOf(MergeError);
        expect((caught as MergeError).status).toBe(422);
    });

    it("stacks as an Error in Error.stack trace", () => {
        const err = new MergeError("test", 500);
        expect(typeof err.stack).toBe("string");
    });

    it("name property is 'MergeError' not 'Error'", () => {
        const err = new MergeError("test", 400);
        expect(err.name).toBe("MergeError");
        expect(err.name).not.toBe("Error");
    });
});
