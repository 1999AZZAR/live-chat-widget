// Prompt-injection firewall (mirrors clone-me's injectionGuard).
// Heuristic shield, not a security boundary: blocks classic override /
// reveal patterns so the model never sees them.

export interface InjectionHit {
	reason: string;
	pattern: string;
}

const PATTERNS: { reason: string; regexes: RegExp[] }[] = [
	{
		reason: 'classic-override',
		regexes: [
			/ignore (all |any )?(previous|prior|earlier|the above|your|system)/i,
			/disregard (all |any )?(previous|prior|earlier|the above|your|system)/i,
			/forget (all |any )?(previous|prior|earlier|your|system)/i,
			/override (the |all |your )?system/i,
			/new instructions?\s*:/i,
			/you are now (a |an |an?)/i,
			/act as (if |though )?(you (are|were)|the)/i,
			/prompt (leak|reveal|show|print|repeat)/i,
			/print (your|the) (system|initial|original) (prompt|instructions)/i,
			/show me your (system|initial|original) (prompt|instructions)/i,
			/reveal your (system|initial|original) (prompt|instructions)/i,
			/abaikan (semua |seluruh )?(instruksi|perintah|aturan) sebelum/i,
			/lupakan (semua )?instruksi/i,
			/jangan (ikuti|patuhi|lanjutkan)/i,
			/ini (adalah )?instruksi baru/i,
			/tunjukkan (system prompt|instruksi sistem|prompt-?mu)/i,
			/bocorkan (system prompt|instruksi)/i,
			/\[(system|SYSTEM|inst)\]/,
			/<\/?(system|instruction)>/i,
			/jailbreak/i,
			/DAN\b/i,
			/roleplay as (a )?(admin|root|system)/i,
			/pretend you are (not|no longer)/i,
		],
	},
];

export function detectInjection(text: string): InjectionHit | null {
	if (!text) return null;
	for (const group of PATTERNS) {
		for (const regex of group.regexes) {
			if (regex.test(text)) {
				return { reason: group.reason, pattern: String(regex) };
			}
		}
	}
	return null;
}
