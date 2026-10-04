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
        platform: "website", title: null, order: 0, workspaceId: "ws1",
        isPublic: true, clicks: 0, createdAt: new Date(), updatedAt: new Date(),
        thumbnailUrl: null, description: null, groupId: null,
        id, ...extra,
    };
}

describe("nestLinks — edge cases", () => {
    it("handles group with single child", () => {
        const group = link("g1", { isGroup: true });
        const child = link("c1", { parentId: "g1" });
        const result = nestLinks([group, child] as never);
        const g = result[0] as typeof group & { children: MockLink[] };
        expect(g.children).toHaveLength(1);
    });

    it("orphan children (parentId references non-existent group) are excluded from top level", () => {
        const orphan = link("o1", { parentId: "nonexistent" });
        const result = nestLinks([orphan] as never);
        // Orphan has parentId so it goes into childrenMap but won't appear as top-level
        expect(result.map((l) => l.id)).not.toContain("o1");
    });

    it("non-group links are not given children array", () => {
        const regularLink = link("l1");
        const result = nestLinks([regularLink] as never);
        expect(result[0]).not.toHaveProperty("children");
    });

    it("multiple groups each get their own children", () => {
        const g1 = link("g1", { isGroup: true });
        const g2 = link("g2", { isGroup: true });
        const c1 = link("c1", { parentId: "g1" });
        const c2 = link("c2", { parentId: "g2" });
        const result = nestLinks([g1, g2, c1, c2] as never);
        expect(result).toHaveLength(2);
        const groups = result as (typeof g1 & { children: MockLink[] })[];
        const resultG1 = groups.find((g) => g.id === "g1")!;
        const resultG2 = groups.find((g) => g.id === "g2")!;
        expect(resultG1.children[0].id).toBe("c1");
        expect(resultG2.children[0].id).toBe("c2");
    });

    it("preserves order of top-level links", () => {
        const links = ["l3", "l1", "l2"].map((id) => link(id));
        const result = nestLinks(links as never);
        expect(result.map((l) => l.id)).toEqual(["l3", "l1", "l2"]);
    });

    it("group without children has empty children array", () => {
        const g = link("g1", { isGroup: true });
        const result = nestLinks([g] as never);
        const group = result[0] as typeof g & { children: MockLink[] };
        expect(group.children).toEqual([]);
    });
});
