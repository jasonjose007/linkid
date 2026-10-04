import { MergeError } from "./accountMerge";

describe("MergeError", () => {
    it("is an instance of Error", () => {
        const err = new MergeError("Something went wrong", 400);
        expect(err).toBeInstanceOf(Error);
    });

    it("has name 'MergeError'", () => {
        const err = new MergeError("test", 500);
        expect(err.name).toBe("MergeError");
    });

    it("stores the message", () => {
        const err = new MergeError("Username already taken", 409);
        expect(err.message).toBe("Username already taken");
    });

    it("stores the HTTP status code", () => {
        const err = new MergeError("Not found", 404);
        expect(err.status).toBe(404);
    });

    it("can be caught as Error", () => {
        expect(() => { throw new MergeError("fail", 400); }).toThrow(Error);
    });

    it("can be caught as MergeError", () => {
        expect(() => { throw new MergeError("fail", 400); }).toThrow(MergeError);
    });

    it("stores 400 status for bad request", () => {
        const err = new MergeError("Bad request", 400);
        expect(err.status).toBe(400);
    });

    it("stores 401 status for unauthorized", () => {
        const err = new MergeError("Password confirmation failed", 401);
        expect(err.status).toBe(401);
    });
});
