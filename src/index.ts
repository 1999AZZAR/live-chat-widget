// Environment setup & configuration
import { generateWidgetJS } from './widget-generator';
import { generateWidgetHTML } from './iframe-generator';
import { LRUCache, memoryCache, getMemoryCacheStats } from './lru-handler';
// @ts-ignore
import systemInstruction from './systemInstruction.txt';
// @ts-ignore
import crawlFileContent from './crawl.txt';
import { matchFaq } from './faq';

interface Env {
	AI: any;
	SYSTEM_PROMPT: KVNamespace;
	RATE_LIMITER_KV: KVNamespace;
	RESPONSE_CACHE_KV: KVNamespace;
	DEBUG?: boolean;
	API_KEY?: string;
	CACHE_TTL?: string;
}

// --- Pre-cache persona files on startup ---
const systemPromptKey = 'system:prompt';
async function getSystemPrompt(env: Env) {
	if (memoryCache.has(systemPromptKey)) {
		return memoryCache.get(systemPromptKey);
	}

	let promptContent = systemInstruction;

	// Try to load from KV if available
	if (env && env.SYSTEM_PROMPT) {
		try {
			const kvPrompt = await env.SYSTEM_PROMPT.get('persona:default');
			if (kvPrompt) {
				promptContent = kvPrompt;
				if (env.DEBUG) console.log('Successfully loaded persona from SYSTEM_PROMPT KV');
			}
		} catch (error) {
			console.error('Error fetching persona from KV:', error);
		}
	}

	const crawlLinks = (crawlFileContent as string)
		.split('\n')
		.filter((line: string) => line.trim().length > 0);
	let enhancedPrompt = promptContent;
	if (crawlLinks.length > 0) {
		enhancedPrompt += '\n\nAdditional resources about me:\n' + crawlLinks.join('\n');
	}
	memoryCache.set(systemPromptKey, enhancedPrompt);
	return enhancedPrompt;
}

// Optional: Initialize a KV-based cache if available
let kvCache = {
	async get(key: string) {
		return null;
	},
	async set(key: string, value: any, ttl?: number) {
		return;
	},
	async has(key: string) {
		return false;
	},
};

// Function to query Wikipedia
async function queryWikipedia(query: string) {
	// Generate a cache key specifically for Wikipedia results
	const cacheKey = `wiki:${query.trim().toLowerCase()}`;

	// Check memory cache first
	if (memoryCache.has(cacheKey)) {
		return memoryCache.get(cacheKey);
	}

	// Check KV cache if available
	if (kvCache.has && (await kvCache.has(cacheKey))) {
		return await kvCache.get(cacheKey);
	}

	try {
		// Use Indonesian Wikipedia for Indonesian queries, English otherwise
		const idMarkers = ['siapa', 'apa', 'jelaskan', 'bagaimana', 'gimana', 'kenapa', 'adalah', 'dimana', 'berapa'];
		const wikiHost = idMarkers.some((m) => query.toLowerCase().includes(m))
			? 'id.wikipedia.org'
			: 'en.wikipedia.org';
		// Use the Wikipedia API (Search)
		const searchUrl = `https://${wikiHost}/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
		const searchResponse = await fetch(searchUrl);
		const searchData: any = await searchResponse.json();

		if (searchData.query && searchData.query.search && searchData.query.search.length > 0) {
			const bestResult = searchData.query.search[0];
			const pageTitle = bestResult.title;

			// Get the page summary
			const summaryUrl = `https://${wikiHost}/api/rest_v1/page/summary/${encodeURIComponent(pageTitle.replace(/ /g, '_'))}`;
			const summaryResponse = await fetch(summaryUrl);
			const summaryData: any = await summaryResponse.json();

			const result = {
				success: true,
				title: summaryData.title || pageTitle,
				content: summaryData.extract || bestResult.snippet.replace(/<[^>]*>/g, ''),
				url: summaryData.content_urls?.desktop?.page || `https://${wikiHost}/wiki/${encodeURIComponent(pageTitle.replace(/ /g, '_'))}`,
			};

			// Store in cache (1 day)
			memoryCache.set(cacheKey, result);
			if (kvCache.set) {
				await kvCache.set(cacheKey, result, 86400);
			}

			return result;
		}

		return { success: false, title: '', content: '', url: '' };
	} catch (error) {
		console.error('Wikipedia query error:', error);
		return { success: false, title: '', content: '', url: '' };
	}
}

// Function to check if we should use Wikipedia for a query
function shouldUseWikipedia(text: string): boolean {
	const keywords = [
		'who is',
		'what is',
		'tell me about',
		'explain',
		'where is',
		'siapa',
		'apa itu',
		'jelaskan',
		'dimana',
		'siapakah',
		'apakah',
		'bagaimana',
		'gimana',
		'kenapa',
		'kapan',
		'berapa',
		'how to',
		'how do',
		'why is',
		"who's",
	];
	const lowerText = text.toLowerCase();
	return keywords.some((kw) => lowerText.includes(kw));
}

// Function to clean up common AI response artifacts
function cleanupFormatting(text: string): string {
	if (!text) return '';
	// Decode HTML entities first, looping until stable: the model sometimes
	// double-encodes (&amp;#x27;), so a single pass leaves a literal &#x27;
	// (decoding hex before &amp; misses it, since the & is shielded by amp;).
	for (let i = 0; i < 3; i++) {
		const prev = text;
		text = text
			.replace(/&amp;/g, '&')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&quot;/g, '"')
			.replace(/&apos;/g, "'")
			.replace(/&#x([0-9A-Fa-f]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
			.replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)));
		if (text === prev) break;
	}
	text = text.replace(/<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

	// Protect URLs and emails from being mangled by regex
	const urls: string[] = [];
	text = text.replace(/([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g, (match) => {
		urls.push(match);
		return `__URL_PLACEHOLDER_${urls.length - 1}__`;
	});
	const protectedText = text.replace(/(https?:\/\/[^\s<]+)/g, (match) => {
		urls.push(match);
		return `__URL_PLACEHOLDER_${urls.length - 1}__`;
	});

	// Replace sequences of more than 2 newlines with just 2 newlines
	let cleanedText = protectedText.replace(/\n{3,}/g, '\n\n');

	// Handle cases where there might be multiple line breaks with spaces between them
	cleanedText = cleanedText.replace(/(\s*\n\s*){3,}/g, '\n\n');

	// Ensure lists are properly formatted (no extra spaces before list items)
	cleanedText = cleanedText.replace(/\n\s+(\d+\.\s|\*\s|-\s)/g, '\n$1');

	// Ensure paragraphs end with proper punctuation when possible
	cleanedText = cleanedText.replace(/([a-zA-Z])(\s*\n\s*\n\s*[A-Z])/g, '$1.$2');

	// Fix spacing after punctuation, but not for placeholders
	cleanedText = cleanedText.replace(/([.,!?:;])([a-zA-Z])/g, '$1 $2');

	// Now restore the protected URLs
	for (let i = 0; i < urls.length; i++) {
		cleanedText = cleanedText.replace(`__URL_PLACEHOLDER_${i}__`, urls[i]);
	}

	return cleanedText;
}

/**
 * Approximate token count for string
 * Heuristic: 1 token ~= 4 characters for English
 */
function approximateTokenCount(text: string): number {
	if (!text) return 0;
	return Math.ceil(text.length / 4);
}

// Simple Jaccard Similarity for sentence deduplication
function jaccardSimilarity(str1: string, str2: string): number {
	const set1 = new Set(
		str1
			.toLowerCase()
			.split(/\W+/)
			.filter((word) => word.length > 0)
	);
	const set2 = new Set(
		str2
			.toLowerCase()
			.split(/\W+/)
			.filter((word) => word.length > 0)
	);

	if (set1.size === 0 && set2.size === 0) return 1.0; // Both empty, considered identical
	if (set1.size === 0 || set2.size === 0) return 0.0; // One empty, one not

	const intersection = new Set([...set1].filter((x) => set2.has(x)));
	const union = new Set([...set1, ...set2]);

	return intersection.size / union.size;
}

// Enhanced deduplication function - this is the main improvement to fix duplicate responses
function deduplicateResponse(text: string, env: Env): string {
	if (!text) return text;

	// Step 2: More general sentence-level deduplication using Jaccard Similarity
	// This helps with cases where sentences are very similar but not identical
	const SIMILARITY_THRESHOLD = 0.8; // Adjust this value (0.0 - 1.0) as needed
	const sentences = text.match(/[^.!?]+[.!?]+\s*/g);
	if (sentences && sentences.length > 3) {
		const uniqueSentences = [];
		const seenSentences = new Set();

		for (const sentence of sentences) {
			const trimmedSentence = sentence.trim();
			if (trimmedSentence.length < 10) {
				// Skip very short sentences
				uniqueSentences.push(sentence);
				continue;
			}

			let isDuplicate = false;
			for (const seen of Array.from(seenSentences) as string[]) {
				if (jaccardSimilarity(trimmedSentence, seen) >= SIMILARITY_THRESHOLD) {
					isDuplicate = true;
					break;
				}
			}

			if (!isDuplicate) {
				uniqueSentences.push(sentence);
				seenSentences.add(trimmedSentence);
			} else {
				if (env && env.DEBUG)
					console.log(
						`Deduplication: Found similar sentence, removing: "${trimmedSentence.substring(0, 50)}..."`
					);
			}
		}

		// If we removed any duplicates
		if (uniqueSentences.length < sentences.length) {
			if (env && env.DEBUG)
				console.log(
					`Deduplication: Removed ${sentences.length - uniqueSentences.length} duplicate or highly similar sentences`
				);
			return uniqueSentences.join('');
		}
	}

	// Step 3: Paragraph-level deduplication (original implementation)
	const paragraphs = text.split(/\n\n+/); // Split by one or more double newlines
	if (paragraphs.length > 1) {
		const uniqueParagraphs = [];
		if (paragraphs[0]) uniqueParagraphs.push(paragraphs[0]);
		for (let i = 1; i < paragraphs.length; i++) {
			if (
				paragraphs[i] &&
				paragraphs[i].trim() !== '' &&
				(!paragraphs[i - 1] || paragraphs[i].trim() !== paragraphs[i - 1].trim())
			) {
				uniqueParagraphs.push(paragraphs[i]);
			}
		}
		return uniqueParagraphs.join('\n\n');
	}

	return text;
}

// Function to initialize KV cache if available
async function initializeKVCache(env: Env) {
	if (env && env.RESPONSE_CACHE_KV) {
		if (env.DEBUG) console.log('Initializing KV cache');

		// Create a more robust KV wrapper with caching functionality
		kvCache = {
			async get(key: string) {
				try {
					const value = await env.RESPONSE_CACHE_KV.get(key);
					if (value) {
						return JSON.parse(value);
					}
					return null;
				} catch (error) {
					console.error('Error getting from KV cache:', error);
					return null;
				}
			},

			async set(key: string, value: any, ttl = 86400) {
				// Default TTL: 1 day
				try {
					await env.RESPONSE_CACHE_KV.put(key, JSON.stringify(value), { expirationTtl: ttl });
				} catch (error) {
					console.error('Error setting KV cache:', error);
				}
			},

			async has(key: string) {
				try {
					const value = await env.RESPONSE_CACHE_KV.get(key);
					return value != null;
				} catch (error) {
					console.error('Error checking KV cache:', error);
					return false;
				}
			},
		};

		return true;
	}

	if (env.DEBUG) console.log('KV binding not available, using memory cache only');
	return false;
}

// Function to send messages to the AI
// Detect reply language: Indonesian, English, or Javanese. Falls back to
// Indonesian for ID visitors, English otherwise (Cloudflare country code).
function detectLanguage(text: string, country: string): string {
	const lower = ` ${text.toLowerCase()} `;
	const has = (words: string[]) => words.some((w) => lower.includes(` ${w} `));
	if (has(['sampean', 'sampeyan', 'kulo', 'piye', 'pripun', 'ora', 'wae', 'opo', 'ngopo', 'sugeng', 'monggo', 'matur', 'nuwun', 'kowe', 'wis', 'durung', 'kari', 'dewe'])) return 'casual Javanese (ngoko)';
	const jvScore = has(['yo', 'iso', 'sampek']) ? 1 : 0;
	const idScore =
		(has(['yang']) ? 1 : 0) + (has(['dan']) ? 1 : 0) + (has(['adalah']) ? 1 : 0) +
		(has(['saya', 'kamu', 'anda']) ? 1 : 0) + (has(['tidak', 'dengan', 'untuk']) ? 1 : 0) +
		(has(['bagaimana', 'kenapa', 'berapa', 'apakah', 'tolong', 'banget', 'dong', 'sih']) ? 1 : 0) +
		(has(['kalo', 'kalau', 'itu', 'ini', 'nggak', 'ngga', 'aja', 'kok', 'saja', 'bisa']) ? 1 : 0) +
		(has(['halo', 'hallo', 'hai', 'pagi', 'siang', 'sore', 'malam', 'makasih', 'maaf']) ? 1 : 0);
	const enScore =
		(has(['hello', 'hey']) ? 1 : 0) + (has(['hi', 'thanks', 'thank you', 'please', 'sorry']) ? 1 : 0) +
		(has(['who', 'are', 'the', 'you', 'your', 'what', 'how', 'when', 'where', 'why', 'can', 'does', 'do', 'is', 'was', 'will', 'with', 'for', 'this', 'that', 'from']) ? 1 : 0);
	if (idScore > 0 && idScore >= enScore && idScore >= jvScore) return 'Indonesian';
	if (enScore > 0 && enScore > idScore) return 'English';
	if (jvScore > 0) return 'casual Javanese (ngoko)';
	return country === 'ID' ? 'Indonesian' : 'English';
}

async function sendToAI(messages: any[], env: Env, country: string = 'US') {
	try {
		// Log request summary only (avoid logging full message content in production)
		if (env.DEBUG) {
			console.log('Processing request with messages:', JSON.stringify(messages, null, 2));
		} else {
			console.log(`Processing AI request with ${messages.length} messages`);
		}

		if (!env.AI) {
			console.error('AI binding is not available. Check your wrangler.toml configuration.');
			return 'Sorry, the AI service is not properly configured.';
		}

		// Pin reply language (ID/EN/JV) before caching so each language caches separately
		const lastMsg = [...messages].reverse().find((m) => m.role === 'user');
		const replyLang = detectLanguage(lastMsg ? lastMsg.content : '', country);
		const langSysIdx = messages.findIndex((m) => m.role === 'system');
		if (langSysIdx !== -1) {
			messages[langSysIdx].content += `\n\n[language-directive] Reply in ${replyLang}. This overrides any other language instruction.`;
		}

		// Local FAQ first: instant zero-neuron answers (works even when AI quota is out)
		const faqAnswer = matchFaq(lastMsg ? lastMsg.content : '', replyLang);
		if (faqAnswer) return faqAnswer;

		// Generate a cache key for this conversation
		const cacheKey = 'v3:' + LRUCache.generateKey(messages);

		// Check memory cache first (fastest)
		if (memoryCache.has(cacheKey)) {
			if (env.DEBUG) console.log('Memory cache hit!');
			return memoryCache.get(cacheKey);
		}

		// Then check KV cache if available (slower but persistent)
		let kvCacheResult = null;
		if (env.RESPONSE_CACHE_KV) {
			kvCacheResult = await kvCache.get(cacheKey);
			if (kvCacheResult) {
				if (env.DEBUG) console.log('KV cache hit!');
				// Update memory cache for faster access next time
				memoryCache.set(cacheKey, kvCacheResult);
				return kvCacheResult;
			}
		}

		// Check if the last user message might benefit from Wikipedia info
		const lastUserMessage = messages.find((m) => m.role === 'user');
		let wikipediaInfo: any = null;

		if (lastUserMessage && shouldUseWikipedia(lastUserMessage.content)) {
			wikipediaInfo = await queryWikipedia(lastUserMessage.content);
			if (env.DEBUG) {
				console.log('Wikipedia query results:', JSON.stringify(wikipediaInfo, null, 2));
			} else if (wikipediaInfo && wikipediaInfo.success) {
				console.log(`Wikipedia integration: Found info for "${wikipediaInfo.title}"`);
			}

			// If Wikipedia returned useful information, add it to the system message
			if (wikipediaInfo && wikipediaInfo.success) {
				// Find the system message
				const systemMessageIndex = messages.findIndex((m) => m.role === 'system');

				if (systemMessageIndex !== -1) {
					// Add Wikipedia info to the system message
					messages[systemMessageIndex].content +=
						`\n\nRelevant information from Wikipedia about "${wikipediaInfo.title}":\n${wikipediaInfo.content}\nSource: ${wikipediaInfo.url}`;
				} else {
					// If no system message exists, add one with the Wikipedia info
					messages.unshift({
						role: 'system',
						content: `Relevant information from Wikipedia about "${wikipediaInfo.title}":\n${wikipediaInfo.content}\nSource: ${wikipediaInfo.url}`,
					});
				}
			}
		}

		// Calculate approximate token usage for input using our more accurate function
		let inputTokens = 0;
		messages.forEach((msg) => {
			inputTokens += approximateTokenCount(msg.content);
		});

		// Set maximum output tokens - leaving space based on input tokens
		// Qwen3-30b-a3b-fp8 context is ~32k tokens; we stay well below with 6k budget.
		// Let's target staying within a safer limit, e.g., 6000 tokens total.
		const MAX_CONTEXT_TOKENS = 6000;
		// Increase the safety buffer from 150 to 250 tokens.
		const MAX_OUTPUT_TOKENS = Math.max(250, MAX_CONTEXT_TOKENS - inputTokens - 250);

		console.log(
			`Approximate input tokens: ${inputTokens}, setting max output tokens: ${MAX_OUTPUT_TOKENS}`
		);

		// Add instruction to prevent repetition
		const systemMessageIndex = messages.findIndex((m) => m.role === 'system');
		if (systemMessageIndex !== -1) {
			messages[systemMessageIndex].content +=
				'\n\nIMPORTANT: Please provide a concise, non-repetitive response. Do not duplicate information within your answer.';
		}

		// Qwen3 is the primary (better instruction-following, fast MoE);
		// chat_template_kwargs disables its thinking mode — answer lands in
		// choices[0].message.content; Llama is fallback.
		let aiResponse: any;
		const AI_MODELS = [
			{ id: '@cf/qwen/qwen3-30b-a3b-fp8', extra: { chat_template_kwargs: { enable_thinking: false } } },
			{ id: '@cf/meta/llama-3.3-70b-instruct-fp8-fast', extra: {} },
		];
		for (let i = 0; i < AI_MODELS.length; i++) {
			try {
				aiResponse = await env.AI.run(AI_MODELS[i].id, {
					messages: messages,
					max_tokens: MAX_OUTPUT_TOKENS,
					temperature: 0.7, // Add some temperature for more natural responses
					top_p: 0.95, // Adjust top_p for more focused responses
					repetition_penalty: 1.1, // Cut repetition at the source instead of regexing it after
					...AI_MODELS[i].extra,
				});
				if (aiResponse) break;
			} catch (err) {
				console.error(`AI model ${AI_MODELS[i].id} failed, falling back:`, err);
				if (i === AI_MODELS.length - 1) throw err;
			}
		}

		console.log('Raw AI response received');

		// Try to extract the response text
		let responseText: string;

		// Based on Cloudflare's documentation for the model
		if (typeof aiResponse === 'string') {
			// Direct string response
			responseText = aiResponse;
			console.log('Response is a string');
		} else if (typeof aiResponse === 'object' && aiResponse !== null) {
			// Workers AI returns either { response } (Llama) or OpenAI-style
			// { choices: [{ message: { content | reasoning_content } }] } (Qwen3).
			if (Array.isArray(aiResponse.choices)) {
				const msg = aiResponse.choices[0]?.message || {};
				responseText = msg.content || msg.reasoning_content || aiResponse.response || aiResponse.text || '';
			} else {
				responseText = aiResponse.response || aiResponse.text || '';
			}
			console.log('Response is an object, extracted text');

			// Check if it's an error object
			if (!responseText && aiResponse.error) {
				responseText = 'Error from AI service: ' + aiResponse.error;
				console.error('AI Error:', aiResponse.error);
			}
		} else {
			responseText = 'Received an unexpected response type.';
			console.error('Unexpected response type:', typeof aiResponse);
		}

		// Clean up the response text formatting
		responseText = cleanupFormatting(responseText);

		// Log AI response summary (avoid full content logging in production)
		if (env.DEBUG) {
			console.log('AI Response (Pre-Deduplication):', responseText.substring(0, 100) + '...');
		}

		// Apply our enhanced deduplication function
		responseText = deduplicateResponse(responseText, env);

		if (env.DEBUG) {
			console.log(
				'Final extracted response text (Post-Deduplication):',
				responseText.substring(0, 100) + '...'
			);
		}

		// If we used Wikipedia, add a citation
		if (wikipediaInfo && wikipediaInfo.success && wikipediaInfo.url && wikipediaInfo.title) {
			// Check if the response doesn't already contain the citation URL
			if (!responseText.includes(wikipediaInfo.url)) {
				const cleanUrl = wikipediaInfo.url.replace(/\s+/g, '');
				// Also check if the title seems reasonable (not a placeholder or error)
				if (
					wikipediaInfo.title.toLowerCase() !== 'no wikipedia articles found for this query.' &&
					wikipediaInfo.title.length > 0 &&
					!responseText.toLowerCase().includes(wikipediaInfo.title.toLowerCase())
				) {
					// Avoid re-adding if title already mentioned
					responseText += `\n\nSource: [Wikipedia - ${wikipediaInfo.title}](${cleanUrl})`;
				}
			}
		}

		// Store the response in the cache
		memoryCache.set(cacheKey, responseText);

		// Also store in KV cache if available
		if (kvCache.set) {
			const ttl = env.CACHE_TTL ? parseInt(env.CACHE_TTL, 10) : 86400;
			await kvCache.set(cacheKey, responseText, ttl);
		}

		return responseText;
	} catch (error: any) {
		console.error('Error in sendToAI:', error);
		// More detailed error information
		if (error.stack) {
			console.error('Error stack:', error.stack);
		}
		if (error.message) {
			console.error('Error message:', error.message);
		}
		const quotaHit = /4006|daily free allocation|quota|rate limit/i.test(error.message || '');
		if (quotaHit) {
			return 'Jatah AI harianku habis — ngobrol lagi besok ya! / Daily AI quota exhausted — try again tomorrow!';
		}
		return 'Sorry, I had trouble processing your request. Error: ' + error.message;
	}
}

// Function to handle request
export default {
	async fetch(request: Request, env: Env) {
		const startTime = Date.now();
		const requestId = crypto.randomUUID();

		// Helper for structured logging
		const log = (message: string, data: any = {}) => {
			console.log(
				JSON.stringify({
					ts: new Date().toISOString(),
					requestId,
					message,
					...data,
				})
			);
		};

		log('Incoming request', {
			method: request.method,
			url: request.url,
			referer: request.headers.get('Referer'),
			hasCFIP: !!request.headers.get('CF-Connecting-IP'),
			hasLimiter: !!env.RATE_LIMITER_KV,
		});

		// Initialize KV cache if available
		if (env && env.RESPONSE_CACHE_KV) {
			await initializeKVCache(env);
		}

		const url = new URL(request.url);

		// Function to validate origin against allowlist
		function isOriginAllowed(origin: string, allowedOrigins: string[] = []) {
			if (!origin) return false;
			return true;
		}

		// Function to validate request origin for API routes
		function validateApiRequestOrigin(request: Request, allowedOrigins: string[] = []) {
			const origin = request.headers.get('Origin');
			const referer = request.headers.get('Referer');

			if (request.url.includes('/api/')) {
				if (origin && isOriginAllowed(origin, allowedOrigins)) {
					return origin;
				}
				if (referer) {
					try {
						const refererUrl = new URL(referer);
						if (isOriginAllowed(refererUrl.origin, allowedOrigins)) {
							return refererUrl.origin;
						}
					} catch (e) {
						console.warn('Invalid Referer header:', referer);
					}
				}
				return null;
			}
			return origin && isOriginAllowed(origin, allowedOrigins) ? origin : null;
		}

		const requestOrigin = validateApiRequestOrigin(request);
		const corsHeaders = {
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
			'Access-Control-Allow-Origin': requestOrigin || '*',
		};

		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: corsHeaders,
			});
		}

		const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown_ip';
		const providedApiKey =
			request.headers.get('Authorization')?.replace('Bearer ', '') ||
			request.headers.get('X-API-Key') ||
			url.searchParams.get('api_key');
		const customerKey = providedApiKey || 'anonymous';

		if (url.pathname.startsWith('/api/') && env.API_KEY && env.API_KEY.trim() !== '') {
			const allowedKeys = env.API_KEY.split(',').map((k: string) => k.trim());
			if (!providedApiKey || !allowedKeys.includes(providedApiKey)) {
				return new Response(
					JSON.stringify({
						error: 'Unauthorized',
						message: 'Valid API key is required for this endpoint.',
					}),
					{
						status: 401,
						headers: { 'Content-Type': 'application/json', ...corsHeaders },
					}
				);
			}
		}

		const rateLimitPromise = (async () => {
			if (!env.RATE_LIMITER_KV) return { exceeded: false };
			try {
				const now = Date.now();
				const currentMinute = Math.floor(now / 60000);
				const nextMinute = currentMinute + 1;
				const secondsUntilNextMinute = (nextMinute * 60000 - now) / 1000;

				let ipRequestCount = 0;
				let dayKey = '';
				let ipDayCount = 0;
				if (clientIP !== 'unknown_ip') {
					const ipKey = `rate_limit:ip:${clientIP}:${currentMinute}`;
					const ipCount = await env.RATE_LIMITER_KV.get(ipKey);
					ipRequestCount = ipCount ? parseInt(ipCount) : 0;
					if (ipRequestCount >= 30) return { exceeded: true, retryAfter: Math.ceil(secondsUntilNextMinute) };
				const currentDay = Math.floor(now / 86400000);
				dayKey = `rate_limit:ipday:${clientIP}:${currentDay}`;
				const dayCount = await env.RATE_LIMITER_KV.get(dayKey);
				ipDayCount = dayCount ? parseInt(dayCount) : 0;
				if (ipDayCount >= 150) return { exceeded: true, retryAfter: Math.ceil(secondsUntilNextMinute) };
				}

				let customerRequestCount = 0;
				if (customerKey !== 'anonymous') {
					const customerKeyLimit = `rate_limit:key:${customerKey}:${currentMinute}`;
					const customerCount = await env.RATE_LIMITER_KV.get(customerKeyLimit);
					customerRequestCount = customerCount ? parseInt(customerCount) : 0;
					if (customerRequestCount >= 100) return { exceeded: true, retryAfter: Math.ceil(secondsUntilNextMinute) };
				}

				if (clientIP !== 'unknown_ip') {
					const ipKey = `rate_limit:ip:${clientIP}:${currentMinute}`;
					await env.RATE_LIMITER_KV.put(ipKey, (ipRequestCount + 1).toString(), { expirationTtl: 60 });
				await env.RATE_LIMITER_KV.put(dayKey, (ipDayCount + 1).toString(), { expirationTtl: 86400 });
				}
				if (customerKey !== 'anonymous') {
					const customerKeyLimit = `rate_limit:key:${customerKey}:${currentMinute}`;
					await env.RATE_LIMITER_KV.put(customerKeyLimit, (customerRequestCount + 1).toString(), { expirationTtl: 60 });
				}
				log('Rate check', { minute: ipRequestCount, day: ipDayCount, ipKnown: clientIP !== 'unknown_ip' });
				return { exceeded: false };
			} catch (error) {
				console.error('Rate limiting error:', error);
				return { exceeded: false };
			}
		})();

		const handleRequest = async (): Promise<Response> => {
			if (url.pathname === '/api/chat' && request.method === 'POST') {
				try {
					const rateLimitResult: any = await rateLimitPromise;
					if (rateLimitResult.exceeded) {
						return new Response(JSON.stringify({ error: 'Too many requests' }), {
							status: 429,
							headers: {
								'Content-Type': 'application/json',
								'Retry-After': rateLimitResult.retryAfter.toString(),
								...corsHeaders,
							},
						});
					}
					const body: any = await request.json();
					const { message } = body;
					let { history = [] } = body;
					if (!message) {
						return new Response(JSON.stringify({ error: 'Message is required' }), {
							status: 400,
							headers: { 'Content-Type': 'application/json', ...corsHeaders },
						});
					}
					const MAX_HISTORY_LENGTH = 10;
					if (history.length > MAX_HISTORY_LENGTH) history = history.slice(history.length - MAX_HISTORY_LENGTH);
					const prompt = await getSystemPrompt(env);
					const messages = [{ role: 'system', content: prompt }];
					if (history.length > 0) messages.push(...history);
					messages.push({ role: 'user', content: message });
					const aiResponse = await sendToAI(messages, env, (request.cf as any)?.country || 'US');
					return new Response(JSON.stringify({ response: aiResponse }), {
						headers: { 'Content-Type': 'application/json', ...corsHeaders },
					});
				} catch (error: any) {
					console.error('Error processing chat:', error);
					return new Response(JSON.stringify({ error: 'Failed to process chat request' }), {
						status: 500,
						headers: { 'Content-Type': 'application/json', ...corsHeaders },
					});
				}
			}

			if (url.pathname === '/api/welcome-message' && request.method === 'GET') {
				try {
					const welcomeLimit = await rateLimitPromise;
					if (welcomeLimit.exceeded) {
						return new Response(JSON.stringify({ error: 'Too many requests' }), {
							status: 429,
							headers: {
								'Content-Type': 'application/json',
								'Retry-After': (welcomeLimit.retryAfter ?? 60).toString(),
								...corsHeaders,
							},
						});
					}
					const prompt = await getSystemPrompt(env);
					const messages = [
						{
							role: 'system',
							content:
								prompt +
								'\n\nPlease provide a brief, friendly welcome message introducing yourself as Mema, Azzar Budiyanto\u2019s personal AI hosting his portfolio live-chat. Keep it concise and engaging.',
						},
					];
					const welcomeMessage = await sendToAI(messages, env, (request.cf as any)?.country || 'US');
					return new Response(JSON.stringify({ message: welcomeMessage }), {
						headers: { 'Content-Type': 'application/json', ...corsHeaders },
					});
				} catch (error) {
					console.error('Error generating welcome message:', error);
					return new Response(JSON.stringify({ error: 'Failed to generate welcome message' }), {
						status: 500,
						headers: { 'Content-Type': 'application/json', ...corsHeaders },
					});
				}
			}

			if (url.pathname === '/api/cache-stats' && request.method === 'GET') {
				const stats = getMemoryCacheStats();
				return new Response(JSON.stringify(stats), {
					headers: { 'Content-Type': 'application/json', ...corsHeaders },
				});
			}

			if (url.pathname === '/widget.js') {
				const workerUrl = `${url.protocol}//${url.host}`;
				const widgetJS = generateWidgetJS(workerUrl);
				return new Response(widgetJS, {
					headers: { 'Content-Type': 'application/javascript', ...corsHeaders },
				});
			}

			if (url.pathname === '/widget-iframe') {
				const widgetHTML = generateWidgetHTML(url);
				return new Response(widgetHTML, {
					headers: { 'Content-Type': 'text/html', ...corsHeaders },
				});
			}

			return new Response('Live Chat Widget Worker is running!', { headers: corsHeaders });
		};

		const response = await handleRequest();
		const duration = Date.now() - startTime;
		log('Request completed', { status: response.status, durationMs: duration });

		const newHeaders = new Headers(response.headers);
		newHeaders.set('X-Request-ID', requestId);
		newHeaders.set('X-Response-Time', `${duration}ms`);

		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: newHeaders,
		});
	},
};
