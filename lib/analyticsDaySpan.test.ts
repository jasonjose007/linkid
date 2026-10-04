import { utcDayStart, utcDayEndExclusive } from "./analyticsUtils";

describe("UTC day boundary — span and interval properties", () => {
    it("span of a single day is exactly 86400 seconds (1 day)", () => {
        const d = new Date("2026-10-04T00:00:00Z");
        const start = utcDayStart(d);
        const end = utcDayEndExclusive(d);
        const spanSeconds = (end.getTime() - start.getTime()) / 1000;
        expect(spanSeconds).toBe(86400);
    });

    it("day start hour is 0 (midnight)", () => {
        const d = new Date("2026-06-15T18:30:00Z");
        expect(utcDayStart(d).getUTCHours()).toBe(0);
    });

    it("day start minutes and seconds are 0", () => {
        const d = new Date("2026-06-15T18:30:45Z");
        const start = utcDayStart(d);
        expect(start.getUTCMinutes()).toBe(0);
        expect(start.getUTCSeconds()).toBe(0);
        expect(start.getUTCMilliseconds()).toBe(0);
    });

    it("end exclusive equals start + 1 day", () => {
        const d = new Date("2026-09-30T12:00:00Z");
        const start = utcDayStart(d);
        const end = utcDayEndExclusive(d);
        const expectedEnd = new Date(start.getTime() + 86_400_000);
        expect(end.getTime()).toBe(expectedEnd.getTime());
    });

    it("leap day 2028-02-29 boundary", () => {
        const leapDay = new Date("2028-02-29T10:00:00Z");
        const start = utcDayStart(leapDay);
        expect(start.toISOString()).toBe("2028-02-29T00:00:00.000Z");
    });

    it("day before leap day → end is 2028-02-29", () => {
        const beforeLeap = new Date("2028-02-28T10:00:00Z");
        const end = utcDayEndExclusive(beforeLeap);
        expect(end.toISOString()).toBe("2028-02-29T00:00:00.000Z");
    });

    it("day start is in UTC (not local time)", () => {
        const d = new Date("2026-10-04T23:00:00Z");
        const start = utcDayStart(d);
        // Should be Oct 4 midnight UTC, not local day boundary
        expect(start.toISOString()).toBe("2026-10-04T00:00:00.000Z");
    });
});
