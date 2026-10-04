import { isLikelyBot, detectDeviceType } from "./analyticsUtils";

describe("isLikelyBot — comprehensive bot user agent coverage", () => {
    const BOT_AGENTS = [
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
        "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)",
        "DuckDuckBot/1.1",
        "facebookexternalhit/1.1",
        "Twitterbot/1.0",
        "WhatsApp/2.23.1",
        "TelegramBot (like TwitterBot)",
        "LinkedInBot/1.0",
        "Mozilla/5.0 HeadlessChrome/120",
        "Mozilla/5.0 (X11; Linux x86_64) Chrome/120 Lighthouse",
        "spider/1.0",
        "crawler/1.0",
    ];

    BOT_AGENTS.forEach((ua) => {
        it(`detects '${ua.slice(0, 40)}...' as bot`, () => {
            expect(isLikelyBot(ua)).toBe(true);
        });
    });

    const HUMAN_AGENTS = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/604.1",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0) AppleWebKit/605.1.15",
        "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120",
    ];

    HUMAN_AGENTS.forEach((ua) => {
        it(`passes '${ua.slice(0, 40)}...' as human`, () => {
            expect(isLikelyBot(ua)).toBe(false);
        });
    });
});

describe("detectDeviceType — device classification", () => {
    it("classifies standard Android phone as mobile", () => {
        expect(detectDeviceType("Mozilla/5.0 (Linux; Android 13; Pixel 7) Chrome/120")).toBe("mobile");
    });

    it("classifies iPad as tablet", () => {
        expect(detectDeviceType("Mozilla/5.0 (iPad; CPU OS 16_0) AppleWebKit/605.1.15")).toBe("tablet");
    });

    it("classifies Windows desktop as desktop", () => {
        expect(detectDeviceType("Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120")).toBe("desktop");
    });

    it("classifies Mac desktop as desktop", () => {
        expect(detectDeviceType("Mozilla/5.0 (Macintosh; Intel Mac OS X 13) Chrome/120")).toBe("desktop");
    });

    it("classifies Linux desktop as desktop", () => {
        expect(detectDeviceType("Mozilla/5.0 (X11; Ubuntu; Linux x86_64) Firefox/121")).toBe("desktop");
    });
});
