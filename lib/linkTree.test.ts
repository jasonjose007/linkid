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

function makeLink(overrides: Partial<MockLink> & Pick<MockLink, "id">): MockLink {
    return {
        parentId: null,
        isGroup: false,
        url: "https://example.com",
        platform: "website",
        title: null,
        order: 0,
        workspaceId: "ws-1",
        isPublic: true,
        clicks: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        thumbnailUrl: null,
        description: null,
        groupId: null,
        ...overrides,
    };
}

describe("nestLinks", () => {
    it("returns empty array for empty input", () => {
        expect(nestLinks([])).toEqual([]);
    });

    it("returns flat links unchanged when no groups exist", () => {
        const links = [makeLink({ id: "l1" }), makeLink({ id: "l2" })];
        const result = nestLinks(links as never);
        expect(result).toHaveLength(2);
        expect(result[0]).not.toHaveProperty("children");
    });

    it("nests child links under their parent group", () => {
        const group = makeLink({ id: "g1", isGroup: true });
        const child1 = makeLink({ id: "c1", parentId: "g1" });
        const child2 = makeLink({ id: "c2", parentId: "g1" });
        const result = nestLinks([group, child1, child2] as never);
        expect(result).toHaveLength(1);
        const groupResult = result[0] as typeof group & { children: MockLink[] };
        expect(groupResult.children).toHaveLength(2);
        expect(groupResult.children.map((c) => c.id)).toContain("c1");
        expect(groupResult.children.map((c) => c.id)).toContain("c2");
    });

    it("excludes child links from the top-level result", () => {
        const group = makeLink({ id: "g1", isGroup: true });
        const child = makeLink({ id: "c1", parentId: "g1" });
        const result = nestLinks([group, child] as never);
        expect(result.map((l) => l.id)).not.toContain("c1");
    });

    it("returns empty children array for group with no children", () => {
        const group = makeLink({ id: "g1", isGroup: true });
        const result = nestLinks([group] as never);
        const groupResult = result[0] as typeof group & { children: MockLink[] };
        expect(groupResult.children).toEqual([]);
    });

    it("handles mix of top-level links and groups", () => {
        const link = makeLink({ id: "l1" });
        const group = makeLink({ id: "g1", isGroup: true });
        const child = makeLink({ id: "c1", parentId: "g1" });
        const result = nestLinks([link, group, child] as never);
        expect(result).toHaveLength(2);
    });
});
