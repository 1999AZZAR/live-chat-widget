// Deep research brief — mirrors hela-enzyme's `research_brief` pattern:
// fan out to multiple query variants in parallel, dedupe cross-source
// overlap, rank, and hand the model enough material to synthesize a
// cited briefing instead of hallucinating.

import { webSearch, SearchHit } from './search';

export interface Brief {
	query: string;
	hits: SearchHit[];
	subject: string; // the distilled subject, reused in the verdict line
}

const SEARCH_CACHE = {
	// sendToAI owns the real KV cache adapter; this just re-uses the same
	// per-query cache everything else uses, so fan-out is cheap.
};

function variants(query: string): string[] {
	const q = query.replace(/\s+/g, ' ').trim();
	const out = [q];
	const lower = q.toLowerCase();
	if (lower.endsWith('?')) out.push(q.replace(/\?+$/, ''));
	if (!/news|latest|update|berita|terbaru/i.test(q)) out.push(`${q} latest news`);
	if (!/overview|explain|what is|pengertian|penjelasan/i.test(q)) out.push(`${q} explained`);
	return [...new Set(out)].slice(0, 3);
}

function normUrl(u: string): string {
	return u
		.toLowerCase()
		.replace(/^https?:\/\//, '')
		.replace(/^www\./, '')
		.replace(/[?#].*$/, '')
		.replace(/\/+$/, '');
}

/**
 * Fan out the query into variants, search them in parallel (Exa → DDG,
 * 24h cached per query), and merge with URL-level dedupe. The first hit
 * for each URL keeps its rank weight.
 */
export async function researchBrief(
	query: string,
	exaApiKey: string,
	cache: { get(k: string): Promise<any>; set(k: string, v: any, ttl?: number): Promise<void> } | null
): Promise<Brief> {
	const qs = variants(query);
	const batches = await Promise.all(
		qs.map((q, i) =>
			webSearch(q, exaApiKey, cache, 6)
				.then((hits) => ({ q, rank: i, hits }))
				.catch(() => ({ q, rank: i, hits: [] as SearchHit[] }))
		)
	);

	const seen = new Map<string, { hit: SearchHit; rank: number }>();
	for (const batch of batches) {
		for (const hit of batch.hits) {
			const key = normUrl(hit.url);
			const existing = seen.get(key);
			if (!existing || batch.rank < existing.rank) {
				seen.set(key, { hit, rank: batch.rank });
			}
		}
	}
	const hits = [...seen.values()]
		.sort((a, b) => a.rank - b.rank)
		.map((v) => v.hit)
		.slice(0, 8);

	console.log(`Research brief: fanned out ${qs.length} queries -> ${hits.length} deduped sources`);
	return { query, hits, subject: query.replace(/\?+$/, '') };
}

export function renderBriefContext(brief: Brief, verdict = false): string {
	if (brief.hits.length === 0) {
		return '\n\n[research] No live sources found. Say the information could not be verified online — do not guess.';
	}
	const lines = brief.hits.map((h, i) => {
		const snippet = h.snippet ? ` — ${h.snippet}` : '';
		return `${i + 1}. ${h.title} (${h.url})${snippet}`;
	});
	const footer = verdict
		? 'End your answer with a single line "Verdict: BENAR / SALAH / TIDAK JELAS" based only on these sources, with the citation right before it.'
		: 'Write a SHORT briefing (max 5 sentences) using ONLY these sources, and cite each claim inline like [1](url). Never add facts not present above.';
	return (
		'\n\n<untrusted data-type="research-brief">\n' +
		(verdict ? `Fact-check ONE claim: "${brief.subject}"\n` : `Research topic: "${brief.subject}"\n`) +
		lines.join('\n') +
		'\n' + footer +
		'\n</untrusted>'
	);
}
