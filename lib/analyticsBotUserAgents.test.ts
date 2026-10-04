import { isLikelyBot } from "./analyticsUtils";

const BOT_AGENTS = [
    "Googlebot/2.1 (+http://www.google.com/bot.html)",
    "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
    "Mozilla/5.0 (compatible; YandexBot/3.0)",
    "DuckDuckBot/1.1",
    "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
    "Twitterbot/1.0",
    "WhatsApp/2.23.1 A",
    "TelegramBot",
    "LinkedInBot/1.0",
    "Mozilla/5.0 HeadlessChrome/120.0.6099.129",
    "Mozilla/5.0 Lighthouse",
    "BaiduSpider",
    "Slurp",
    "web spider/1.0",
    "SEO crawler/2.0",
];

const HUMAN_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16 Safari/605.1.15",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36",
];

describe("isLikelyBot — exhaustive bot user agent detection", () => {
    BOT_AGENTS.forEach((ua) => {
        it(`detects as bot: ${ua.slice(0, 45)}`, () => {
            expect(isLikelyBot(ua)).toBe(true);
        });
    });
});

describe("isLikelyBot — human user agent passthrough", () => {
    HUMAN_AGENTS.forEach((ua) => {
        it(`passes as human: ${ua.slice(0, 45)}`, () => {
            expect(isLikelyBot(ua)).toBe(false);
        });
    });
});
