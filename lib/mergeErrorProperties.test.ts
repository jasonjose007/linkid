import { MergeError } from "./accountMerge";

describe("MergeError — property enumeration and type checks", () => {
    it("is a proper Error subclass", () => {
        const err = new MergeError("test", 400);
        expect(err instanceof Error).toBe(true);
        expect(err instanceof MergeError).toBe(true);
    });

    it("name is 'MergeError' (not 'Error')", () => {
        expect(new MergeError("test", 400).name).toBe("MergeError");
        expect(new MergeError("test", 400).name).not.toBe("Error");
    });

    it("has stack property (Error prototype)", () => {
        expect(typeof new MergeError("test", 500).stack).toBe("string");
    });

    it("status is a number", () => {
        expect(typeof new MergeError("test", 400).status).toBe("number");
    });

    it("message is a string", () => {
        expect(typeof new MergeError("test", 400).message).toBe("string");
    });

    it("creates multiple instances with independent properties", () => {
        const e1 = new MergeError("Error 1", 400);
        const e2 = new MergeError("Error 2", 401);
        expect(e1.message).toBe("Error 1");
        expect(e2.message).toBe("Error 2");
        expect(e1.status).toBe(400);
        expect(e2.status).toBe(401);
    });

    it("throws and is catchable as MergeError", () => {
        let caught: MergeError | null = null;
        try {
            throw new MergeError("caught", 409);
        } catch (e) {
            if (e instanceof MergeError) caught = e;
        }
        expect(caught).not.toBeNull();
        expect(caught?.status).toBe(409);
        expect(caught?.message).toBe("caught");
    });
});
