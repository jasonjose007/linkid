import { getDeepLink } from "./deeplink";

describe("getDeepLink — TikTok and Instagram deep links", () => {
    describe("TikTok", () => {
        it("generates user profile deep link", () => {
            const result = getDeepLink("tiktok", "https://tiktok.com/@creator123");
            expect(result.android).toContain("creator123");
        });

        it("android scheme is snssdk1128 for profiles", () => {
            const result = getDeepLink("tiktok", "https://tiktok.com/@user");
            expect(result.android).toContain("snssdk1128://");
        });

        it("ios scheme is snssdk1233 for profiles", () => {
            const result = getDeepLink("tiktok", "https://tiktok.com/@user");
            expect(result.ios).toContain("snssdk1233://");
        });

        it("returns null for short link (vm.tiktok.com)", () => {
            const result = getDeepLink("tiktok", "https://vm.tiktok.com/abc123");
            expect(result.android).toBeNull();
            expect(result.ios).toBeNull();
        });

        it("handles username with @ stripped", () => {
            const result = getDeepLink("tiktok", "https://www.tiktok.com/@myuser123");
            expect(result.android).toContain("myuser123");
        });
    });

    describe("Instagram", () => {
        it("user profile URL generates instagram:// scheme", () => {
            const result = getDeepLink("instagram", "https://instagram.com/username");
            expect(result.android?.startsWith("instagram://")).toBe(true);
        });

        it("android and iOS have the same scheme for profile URLs", () => {
            const result = getDeepLink("instagram", "https://instagram.com/user");
            expect(result.android).toBe(result.ios);
        });

        it("generates correct profile deep link with ?username= format", () => {
            const result = getDeepLink("instagram", "https://instagram.com/myaccount");
            expect(result.android).toContain("?username=myaccount");
        });

        it("returns null for unsupported platform", () => {
            const result = getDeepLink("nonexistent", "https://nonexistent.com");
            expect(result.android).toBeNull();
            expect(result.ios).toBeNull();
        });
    });
});
