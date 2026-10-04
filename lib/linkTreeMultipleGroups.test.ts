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

describe("nestLinks — multiple independent groups", () => {
    it("3 groups each with 2 children", () => {
        const groups = ["g1", "g2", "g3"].map((id) => link(id, { isGroup: true }));
        const children = groups.flatMap((g) => [
            link(`${g.id}-c1`, { parentId: g.id }),
            link(`${g.id}-c2`, { parentId: g.id }),
        ]);
        const result = nestLinks([...groups, ...children] as never);
        expect(result).toHaveLength(3);
        for (const r of result) {
            const group = r as ML & { children: ML[] };
            expect(group.children).toHaveLength(2);
        }
    });

    it("groups with different child counts", () => {
        const g1 = link("g1", { isGroup: true });
        const g2 = link("g2", { isGroup: true });
        const children = [
            link("c1", { parentId: "g1" }),
            link("c2", { parentId: "g1" }),
            link("c3", { parentId: "g1" }),
            link("c4", { parentId: "g2" }),
        ];
        const result = nestLinks([g1, g2, ...children] as never);
        const r1 = result.find((l) => l.id === "g1") as ML & { children: ML[] };
        const r2 = result.find((l) => l.id === "g2") as ML & { children: ML[] };
        expect(r1.children).toHaveLength(3);
        expect(r2.children).toHaveLength(1);
    });

    it("regular links between groups are preserved", () => {
        const g1 = link("g1", { isGroup: true });
        const regular = link("r1");
        const g2 = link("g2", { isGroup: true });
        const c1 = link("c1", { parentId: "g1" });
        const result = nestLinks([g1, regular, g2, c1] as never);
        const ids = result.map((l) => l.id);
        expect(ids).toContain("g1");
        expect(ids).toContain("r1");
        expect(ids).toContain("g2");
        expect(ids).not.toContain("c1");
    });
});
