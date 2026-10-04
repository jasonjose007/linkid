import { utcDayStart, utcDayEndExclusive } from "./analyticsUtils";

describe("UTC day boundary functions — edge cases", () => {
    describe("utcDayStart", () => {
        it("returns midnight UTC for noon input", () => {
            const noon = new Date("2026-10-04T12:00:00.000Z");
            expect(utcDayStart(noon).toISOString()).toBe("2026-10-04T00:00:00.000Z");
        });

        it("returns same day for 23:59:59 input", () => {
            const late = new Date("2026-10-04T23:59:59.999Z");
            expect(utcDayStart(late).toISOString()).toBe("2026-10-04T00:00:00.000Z");
        });

        it("returns correct day for exactly midnight input", () => {
            const midnight = new Date("2026-10-04T00:00:00.000Z");
            expect(utcDayStart(midnight).toISOString()).toBe("2026-10-04T00:00:00.000Z");
        });

        it("handles month boundary (Oct 31 → Nov 1)", () => {
            const halloween = new Date("2026-10-31T23:30:00.000Z");
            expect(utcDayStart(halloween).toISOString()).toBe("2026-10-31T00:00:00.000Z");
        });

        it("handles year boundary (Dec 31)", () => {
            const nye = new Date("2026-12-31T18:00:00.000Z");
            expect(utcDayStart(nye).toISOString()).toBe("2026-12-31T00:00:00.000Z");
        });
    });

    describe("utcDayEndExclusive", () => {
        it("is exactly 86400000ms after day start", () => {
            const d = new Date("2026-06-15T10:00:00Z");
            const start = utcDayStart(d);
            const end = utcDayEndExclusive(d);
            expect(end.getTime() - start.getTime()).toBe(86_400_000);
        });

        it("end is next day midnight UTC", () => {
            const d = new Date("2026-10-04T00:00:00Z");
            expect(utcDayEndExclusive(d).toISOString()).toBe("2026-10-05T00:00:00.000Z");
        });

        it("handles month boundary — October 31 end is November 1 midnight", () => {
            const d = new Date("2026-10-31T12:00:00Z");
            expect(utcDayEndExclusive(d).toISOString()).toBe("2026-11-01T00:00:00.000Z");
        });
    });
});
