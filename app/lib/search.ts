// Lightweight client-side product search: tokenized, multi-field, relevance-ranked.
// Every query keyword must match somewhere (AND), results are scored so the most
// relevant products surface first. Fast enough to run on every keystroke because
// the per-product searchable text is built once up front (buildSearchIndex).

const norm = (s: any) => String(s ?? "").toLowerCase();

// Fields we search, with how much a match in each is worth.
const FIELD_WEIGHTS: { key: string; weight: number }[] = [
    { key: "name", weight: 6 },
    { key: "brand", weight: 4 },
    { key: "model", weight: 4 },
    { key: "category", weight: 3 },
    { key: "deviceType", weight: 2 },
    { key: "subCategory", weight: 2 },
    { key: "tag", weight: 1 },
    { key: "description", weight: 1 },
];

export interface SearchDoc {
    product: any;
    fields: { text: string; weight: number }[];
    blob: string;
}

/** Precompute the searchable text for each product once. */
export function buildSearchIndex(products: any[]): SearchDoc[] {
    return (products || []).map((product) => {
        const fields: { text: string; weight: number }[] = [];
        for (const f of FIELD_WEIGHTS) {
            const v = product[f.key];
            if (v) fields.push({ text: norm(v), weight: f.weight });
        }
        // product.types is [{ name, price }] — the finishes (Matte, Privacy, Clear…)
        if (Array.isArray(product.types)) {
            const t = product.types.map((x: any) => x?.name).filter(Boolean).join(" ");
            if (t) fields.push({ text: norm(t), weight: 2 });
        }
        const blob = fields.map((f) => f.text).join(" ");
        return { product, fields, blob };
    });
}

/** Split a query into lowercase keyword tokens. */
export function tokenize(q: string): string[] {
    return norm(q).split(/[^a-z0-9]+/).filter(Boolean);
}

// Score how well one token matches a single field's text.
function scoreToken(token: string, text: string, weight: number): number {
    const idx = text.indexOf(token);
    if (idx === -1) return 0;
    let s = weight;
    // Bonus when the token starts a word (e.g. "pro" in "iPhone Pro" not "approve")
    if (idx === 0 || !/[a-z0-9]/.test(text[idx - 1])) s += 1.5;
    // Bonus when the token is a whole word
    const end = idx + token.length;
    if (end === text.length || !/[a-z0-9]/.test(text[end])) s += 1;
    return s;
}

/**
 * Rank products for a query. Returns the matching products, most relevant first.
 * A product matches only if EVERY query token is found in at least one field.
 */
export function searchDocs(docs: SearchDoc[], query: string): any[] {
    const tokens = tokenize(query);
    if (tokens.length === 0) return [];
    const phrase = norm(query).trim();

    const scored: { product: any; score: number }[] = [];
    for (const doc of docs) {
        let total = 0;
        let allMatched = true;
        for (const token of tokens) {
            let best = 0;
            for (const f of doc.fields) {
                const s = scoreToken(token, f.text, f.weight);
                if (s > best) best = s;
            }
            if (best === 0) { allMatched = false; break; }
            total += best;
        }
        if (!allMatched) continue;
        // Bonus when the whole query appears contiguously (a very strong signal)
        if (phrase.length > 2 && doc.blob.includes(phrase)) total += 5;
        scored.push({ product: doc.product, score: total });
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.map((s) => s.product);
}

/** Boolean predicate for filtering a list in place (used by listing pages). */
export function matchesQuery(product: any, query: string): boolean {
    const tokens = tokenize(query);
    if (tokens.length === 0) return true;
    const blob = norm(
        [
            product.name,
            product.brand,
            product.model,
            product.category,
            product.deviceType,
            product.subCategory,
            product.tag,
            Array.isArray(product.types) ? product.types.map((t: any) => t?.name).join(" ") : "",
        ]
            .filter(Boolean)
            .join(" ")
    );
    return tokens.every((tok) => blob.includes(tok));
}
