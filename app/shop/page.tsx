import ShopClient from "./ShopClient";

// Universal listing page: every navbar dropdown item links here with
// query params, e.g. /shop?category=tempered-glass&device=Mobile
export default async function ShopPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const sp = await searchParams;
    const pick = (key: string) => (typeof sp[key] === "string" ? (sp[key] as string) : undefined);

    return (
        <ShopClient
            filters={{
                category: pick("category"),
                device: pick("device"),
                type: pick("type"),
                finish: pick("finish"),
                model: pick("model"),
                tag: pick("tag"),
            }}
        />
    );
}
