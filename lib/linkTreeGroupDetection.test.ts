import { nestLinks } from "./linkTree";

type ML = {
    id: string; parentId: string | null; isGroup: boolean; url: string;
    platform: string; title: string | null; order: number; workspaceId: string;
    isPublic: boolean; clicks: number; createdAt: Date; updatedAt: Date;
    thumbnailUrl: string | null; description: string | null; groupId: string | null;
};

function link(id: string, extra: Partial<ML> = {}): ML {
    return {
        parentId: null, isGroup: false, url: "https://ex.com", platform: "website",
        title: null, order: 0, workspaceId: "ws", isPublic: true, clicks: 0,
        createdAt: new Date(), updatedAt: new Date(), thumbnailUrl: null,
        description: null, groupId: null, id, ...extra,
    };
}

describe("nestLinks — group detection edge cases", () => {
    it("isGroup: false link does NOT get children even if parentId matches its id", () => {
        const parent = link("p1", { isGroup: false });
        const child = link("c1", { parentId: "p1" });
        const result = nestLinks([parent, child] as never);
        // p1 is not a group, so c1 would be in childrenMap but p1 is not treated as group
        expect(result.some((l) => l.id === "p1")).toBe(true);
        const p1 = result.find((l) => l.id === "p1");
        expect((p1 as any).children).toBeUndefined();
    });

    it("isGroup: true gives empty children array for group with no matching children", () => {
        const group = link("g1", { isGroup: true });
        const result = nestLinks([group] as never);
        const g = result[0] as ML & { children: ML[] };
        expect(g.children).toEqual([]);
    });

    it("correctly differentiates between group links and regular links", () => {
        const g = link("g1", { isGroup: true });
        const r1 = link("r1");
        const r2 = link("r2");
        const c1 = link("c1", { parentId: "g1" });

        const result = nestLinks([g, r1, r2, c1] as never);
        expect(result).toHaveLength(3); // g1, r1, r2 (c1 is inside g1)

        const group = result.find((l) => l.id === "g1") as ML & { children: ML[] };
        expect(group.children).toHaveLength(1);
        expect(group.children[0].id).toBe("c1");

        const regular1 = result.find((l) => l.id === "r1");
        expect((regular1 as any).children).toBeUndefined();
    });
});
