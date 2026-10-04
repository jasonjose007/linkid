import { utcDayStart, utcDayEndExclusive } from "./analyticsUtils";

describe("UTC day boundaries — weekday and weekend edge cases", () => {
    // 2026-11-02 is Monday (UTC)
    const MONDAY = new Date("2026-11-02T10:00:00Z");
    // 2026-11-01 is Sunday (UTC)
    const SUNDAY = new Date("2026-11-01T10:00:00Z");

    it("Monday start is 2026-11-02T00:00:00Z", () => {
        expect(utcDayStart(MONDAY).toISOString()).toBe("2026-11-02T00:00:00.000Z");
    });

    it("Sunday start is 2026-11-01T00:00:00Z", () => {
        expect(utcDayStart(SUNDAY).toISOString()).toBe("2026-11-01T00:00:00.000Z");
    });

    it("Monday end is 2026-11-03T00:00:00Z (Tuesday)", () => {
        expect(utcDayEndExclusive(MONDAY).toISOString()).toBe("2026-11-03T00:00:00.000Z");
    });

    it("Sunday end is 2026-11-02T00:00:00Z (Monday)", () => {
        expect(utcDayEndExclusive(SUNDAY).toISOString()).toBe("2026-11-02T00:00:00.000Z");
    });

    it("day of week is preserved correctly in UTC", () => {
        expect(utcDayStart(MONDAY).getUTCDay()).toBe(1); // Monday
        expect(utcDayStart(SUNDAY).getUTCDay()).toBe(0); // Sunday
    });

    it("start and end cover exactly 24 hours", () => {
        const start = utcDayStart(MONDAY);
        const end = utcDayEndExclusive(MONDAY);
        expect((end.getTime() - start.getTime()) / 3_600_000).toBe(24);
    });

    it("end of one day equals start of next day", () => {
        const sundayEnd = utcDayEndExclusive(SUNDAY);
        const mondayStart = utcDayStart(MONDAY);
        expect(sundayEnd.getTime()).toBe(mondayStart.getTime());
    });
});
