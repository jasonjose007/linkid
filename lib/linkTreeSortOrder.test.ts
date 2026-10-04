import { nestLinks } from "./linkTree";

type MockLink = {
    id: string;
    parentId: string | null;
    isGroup: boolean;
    url: string;
    platform: string;
    title: string | null;
    order: number;
    workspaceId: string;
    isPublic: boolean;
    clicks: number;
    createdAt: Date;
    updatedAt: Date;
    thumbnailUrl: string | null;
    description: string | null;
    groupId: string | null;
};

function link(id: string, extra: Partial<MockLink> = {}): MockLink {
    return {
        parentId: null, isGroup: false, url: "https://example.com",
        platform: "website", title: null, order: 0, workspaceId: "ws",
        isPublic: true, clicks: 0, createdAt: new Date(), updatedAt: new Date(),
        thumbnailUrl: null, description: null, groupId: null,
        id, ...extra,
    };
}

describe("nestLinks — input order preservation", () => {
    it("preserves insertion order for top-level links", () => {
        const input = [link("z"), link("a"), link("m"), link("b")];
        const result = nestLinks(input as never);
        expect(result.map((l) => l.id)).toEqual(["z", "a", "m", "b"]);
    });

    it("preserves insertion order for group children", () => {
        const g = link("g1", { isGroup: true });
        const c1 = link("c3", { parentId: "g1" });
        const c2 = link("c1", { parentId: "g1" });
        const c3 = link("c2", { parentId: "g1" });
        const result = nestLinks([g, c1, c2, c3] as never);
        const group = result[0] as typeof g & { children: MockLink[] };
        expect(group.children.map((c) => c.id)).toEqual(["c3", "c1", "c2"]);
    });

    it("top-level group appears where inserted in input", () => {
        const l1 = link("l1");
        const g1 = link("g1", { isGroup: true });
        const l2 = link("l2");
        const result = nestLinks([l1, g1, l2] as never);
        const ids = result.map((l) => l.id);
        expect(ids.indexOf("l1")).toBeLessThan(ids.indexOf("g1"));
        expect(ids.indexOf("g1")).toBeLessThan(ids.indexOf("l2"));
    });

    it("links with same order value maintain insertion order", () => {
        const links = ["x", "y", "z"].map((id) => link(id, { order: 0 }));
        const result = nestLinks(links as never);
        expect(result.map((l) => l.id)).toEqual(["x", "y", "z"]);
    });
});
