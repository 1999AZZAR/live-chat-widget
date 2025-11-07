// Environment setup & configuration
import { generateWidgetJS } from './widget-generator.js';
import { generateWidgetHTML } from './iframe-generator.js';
import { LRUCache, memoryCache, getMemoryCacheStats } from './lru-handler.js';
import systemInstruction from './systemInstruction.txt';
import crawlFileContent from './crawl.txt';

// --- Pre-cache persona files on startup ---
const systemPromptKey = 'system:prompt';
function getSystemPrompt() {
  if (memoryCache.has(systemPromptKey)) {
    return memoryCache.get(systemPromptKey);
  }
  const crawlLinks = crawlFileContent.split('\n').filter(line => line.trim().length > 0);
  let enhancedPrompt = systemInstruction;
  if (crawlLinks.length > 0) {
    enhancedPrompt += '\n\nAdditional resources about me:\n' + crawlLinks.join('\n');
  }
  memoryCache.set(systemPromptKey, enhancedPrompt);
  return enhancedPrompt;
}
// Immediately cache the prompt when the worker initializes
getSystemPrompt();


// Optional: Initialize a KV-based cache if available
let kvCache = {
  async get(key) { return null; },
  async set(key, value) { return; },
  async has(key) { return false; }
};


// Function to query Wikipedia
async function queryWikipedia(query) {
  // Generate a cache key specifically for Wikipedia results
  const cacheKey = `wiki:${query.trim().toLowerCase()}`;
  
  // Check memory cache first
  if (memoryCache.has(cacheKey)) {
    console.log(`Wikipedia cache hit for: ${query}`);
    return memoryCache.get(cacheKey);
  }
  
  try {
    console.log(`Querying Wikipedia for: ${query}`);
    
    // Encode the query for URL
    const encodedQuery = encodeURIComponent(query);
    
    // First, search for relevant Wikipedia articles
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodedQuery}&format=json&origin=*`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    // If no results, return empty
    if (!searchData.query || !searchData.query.search || searchData.query.search.length === 0) {
      const result = { success: false, message: "No Wikipedia articles found for this query." };
      memoryCache.set(cacheKey, result);
      return result;
    }
    
    // Get the first result's page ID
    const pageId = searchData.query.search[0].pageid;
    
    // Fetch the content of the article
    const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&pageids=${pageId}&format=json&origin=*`;
    const contentResponse = await fetch(contentUrl);
    const contentData = await contentResponse.json();
    
    // Extract the article content
    const page = contentData.query.pages[pageId];
    const title = page.title;
    const extract = page.extract;
    
    // Create the result
    const result = {
      success: true,
      title: title,
      content: extract,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`
    };
    
    // Cache the result
    memoryCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error('Error querying Wikipedia:', error);
    return { success: false, message: "Failed to query Wikipedia: " + error.message };
  }
}

// Function to determine if a query might benefit from Wikipedia
function shouldUseWikipedia(message) {
  // Check for explicit requests for information
  const informationPatterns = [
    /what is/i, /who is/i, /tell me about/i, /information on/i,
    /when was/i, /where is/i, /how does/i, /definition of/i,
    /explain/i, /describe/i, /history of/i, /facts about/i
  ];

  // Keywords that suggest the AI should answer from its persona, not Wikipedia
  const personaKeywords = [
    /you/i, /your/i, /creator/i, /azzar/i, /frea/i, // FREA is the bot's name
    /who made you/i, /who created you/i
  ];

  if (personaKeywords.some(pattern => pattern.test(message))) {
    console.log('Query pertains to persona, skipping Wikipedia.');
    return false; // AI should answer this from persona
  }
  
  return informationPatterns.some(pattern => pattern.test(message));
}

// A more conservative and reliable token counting function based on character length.
function approximateTokenCount(text) {
  if (!text) return 0;
  // Heuristic: 1 token is roughly 3.5 characters. Using a lower divisor is more conservative.
  return Math.ceil(text.length / 3.5);
}

// Function to clean up excessive blank lines in text
function cleanupFormatting(text) {
  if (!text) return text;
  
  // First, identify and temporarily protect URLs from formatting changes
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = [];
  let protectedText = text.replace(urlRegex, function(match) {
    urls.push(match);
    return `__URL_PLACEHOLDER_${urls.length - 1}__`;
  });
  
  // Replace sequences of more than 2 newlines with just 2 newlines
  let cleanedText = protectedText.replace(/\n{3,}/g, '\n\n');
  
  // Handle cases where there might be multiple line breaks with spaces between them
  cleanedText = cleanedText.replace(/(\s*\n\s*){3,}/g, '\n\n');
  
  // Ensure lists are properly formatted (no extra spaces before list items)
  cleanedText = cleanedText.replace(/\n\s+(\d+\.\s|\*\s|\-\s)/g, '\n$1');
  
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

// Helper function to calculate Jaccard Similarity between two strings
function jaccardSimilarity(s1, s2) {
  const set1 = new Set(s1.toLowerCase().split(/\W+/).filter(word => word.length > 0));
  const set2 = new Set(s2.toLowerCase().split(/\W+/).filter(word => word.length > 0));
  
  if (set1.size === 0 && set2.size === 0) return 1.0; // Both empty, considered identical
  if (set1.size === 0 || set2.size === 0) return 0.0; // One empty, one not
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

// Enhanced deduplication function - this is the main improvement to fix duplicate responses
function deduplicateResponse(text) {
  if (!text) return text;
  
  // Step 1: Check for patterns related to creator/bot introduction that commonly repeat
  const introPatterns = [
    /^(My creator is azzar|azzar Budiyanto is a freelance)/i,
    /^(FREA is an AI assistant|I am FREA, an AI assistant)/i,
    /^(As an AI assistant|As FREA, an AI assistant)/i
  ];
  
  for (const pattern of introPatterns) {
    const parts = text.split(pattern);
    // If we have multiple matches of the same intro pattern
    if (parts.length >= 3) {
      // First part is anything before first match, often empty
      // Second part is the matched content in the first match and content after it
      const firstSection = parts[0] + (pattern.source.replace(/^\^|\(|\).*$/g, '') + parts[1]);
      
      // Only keep the first section if it's substantial
      if (firstSection.trim().length > 50) {
        if (env && env.DEBUG) console.log('Deduplication: Found repeated introduction pattern, keeping first instance.');
        return firstSection.trim();
      }
    }
  }
  
  // Step 2: More general sentence-level deduplication using Jaccard Similarity
  // This helps with cases where sentences are very similar but not identical
  const SIMILARITY_THRESHOLD = 0.8; // Adjust this value (0.0 - 1.0) as needed
  const sentences = text.match(/[^.!?]+[.!?]+\s*/g);
  if (sentences && sentences.length > 3) {
    const uniqueSentences = [];
    const seenSentences = new Set();
    
    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (trimmedSentence.length < 10) { // Skip very short sentences
        uniqueSentences.push(sentence);
        continue;
      }

      let isDuplicate = false;
      for (const seen of seenSentences) {
        if (jaccardSimilarity(trimmedSentence, seen) >= SIMILARITY_THRESHOLD) {
          isDuplicate = true;
          break;
        }
      }

      if (!isDuplicate) {
        uniqueSentences.push(sentence);
        seenSentences.add(trimmedSentence);
      } else {
        if (env && env.DEBUG) console.log(`Deduplication: Found similar sentence, removing: "${trimmedSentence.substring(0, 50)}..."`);
      }
    }
    
    // If we removed any duplicates
    if (uniqueSentences.length < sentences.length) {
      if (env && env.DEBUG) console.log(`Deduplication: Removed ${sentences.length - uniqueSentences.length} duplicate or highly similar sentences`);
      return uniqueSentences.join('');
    }
  }
  
  // Step 3: Paragraph-level deduplication (original implementation)
  const paragraphs = text.split(/\n\n+/); // Split by one or more double newlines
  if (paragraphs.length > 1) {
    const uniqueParagraphs = [];
    if (paragraphs[0]) uniqueParagraphs.push(paragraphs[0]);
    for (let i = 1; i < paragraphs.length; i++) {
      if (paragraphs[i] && paragraphs[i].trim() !== '' && 
          (!paragraphs[i-1] || paragraphs[i].trim() !== paragraphs[i-1].trim())) {
        uniqueParagraphs.push(paragraphs[i]);
      }
    }
    return uniqueParagraphs.join('\n\n');
  }
  
  return text;
}

// Function to initialize KV cache if available
async function initializeKVCache(env) {
  if (env && env.KV) {
    if (env.DEBUG) console.log('Initializing KV cache');

    // Create a more robust KV wrapper with caching functionality
    kvCache = {
      async get(key) {
        try {
          const value = await env.KV.get(key);
          if (value) {
            return JSON.parse(value);
          }
          return null;
        } catch (error) {
          console.error('Error getting from KV cache:', error);
          return null;
        }
      },

      async set(key, value, ttl = 86400) { // Default TTL: 1 day
        try {
          await env.KV.put(key, JSON.stringify(value), { expirationTtl: ttl });
        } catch (error) {
          console.error('Error setting KV cache:', error);
        }
      },

      async has(key) {
        try {
          const value = await env.KV.get(key);
          return value != null;
        } catch (error) {
          console.error('Error checking KV cache:', error);
          return false;
        }
      }
    };

    return true;
  }

  if (env.DEBUG) console.log('KV binding not available, using memory cache only');
  return false;
}

  // Function to send messages to the AI
async function sendToAI(messages, env) {
  try {
    // Log request summary only (avoid logging full message content in production)
    if (env.DEBUG) {
      console.log('Processing request with messages:', JSON.stringify(messages, null, 2));
    } else {
      console.log(`Processing AI request with ${messages.length} messages`);
    }
    
    if (!env.AI) {
      console.error('AI binding is not available. Check your wrangler.toml configuration.');
      return "Sorry, the AI service is not properly configured.";
    }
    
    // Generate a cache key for this conversation
    const cacheKey = LRUCache.generateKey(messages);
    
    // Check memory cache first (fastest)
    if (memoryCache.has(cacheKey)) {
      if (env.DEBUG) console.log('Memory cache hit!');
      return memoryCache.get(cacheKey);
    }

    // Then check KV cache if available (slower but persistent)
    let kvCacheResult = null;
    if (kvCache.has) {
      kvCacheResult = await kvCache.get(cacheKey);
      if (kvCacheResult) {
        if (env.DEBUG) console.log('KV cache hit!');
        // Update memory cache for faster access next time
        memoryCache.set(cacheKey, kvCacheResult);
        return kvCacheResult;
      }
    }
    
    // Check if the last user message might benefit from Wikipedia info
    const lastUserMessage = messages.find(m => m.role === 'user');
    let wikipediaInfo = null;
    
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
        const systemMessageIndex = messages.findIndex(m => m.role === 'system');
        
        if (systemMessageIndex !== -1) {
          // Add Wikipedia info to the system message
          messages[systemMessageIndex].content += `\n\nRelevant information from Wikipedia about "${wikipediaInfo.title}":\n${wikipediaInfo.content}\nSource: ${wikipediaInfo.url}`;
        } else {
          // If no system message exists, add one with the Wikipedia info
          messages.unshift({
            role: 'system',
            content: `Relevant information from Wikipedia about "${wikipediaInfo.title}":\n${wikipediaInfo.content}\nSource: ${wikipediaInfo.url}`
          });
        }
      }
    }
    
    // Calculate approximate token usage for input using our more accurate function
    let inputTokens = 0;
    messages.forEach(msg => {
      inputTokens += approximateTokenCount(msg.content);
    });
    
    // Set maximum output tokens - leaving space based on input tokens
    // Model context limit is about 8k-16k tokens depending on the specific model
    // Let's target staying within a safer limit, e.g., 6000 tokens total.
    const MAX_CONTEXT_TOKENS = 6000;
    // Increase the safety buffer from 150 to 250 tokens.
    const MAX_OUTPUT_TOKENS = Math.max(250, MAX_CONTEXT_TOKENS - inputTokens - 250); 
    
    console.log(`Approximate input tokens: ${inputTokens}, setting max output tokens: ${MAX_OUTPUT_TOKENS}`);
    
    // Add instruction to prevent repetition
    const systemMessageIndex = messages.findIndex(m => m.role === 'system');
    if (systemMessageIndex !== -1) {
      messages[systemMessageIndex].content += '\n\nIMPORTANT: Please provide a concise, non-repetitive response. Do not duplicate information within your answer.';
    }
    
    // Log cache miss and call the AI API
    console.log('Cache miss - calling AI service');
    const aiResponse = await env.AI.run('@cf/meta/llama-3.1-70b-instruct', {
      messages: messages,
      max_tokens: MAX_OUTPUT_TOKENS,
      temperature: 0.7, // Add some temperature for more natural responses
      top_p: 0.95,      // Adjust top_p for more focused responses
      // Removed aggressive stop_sequences to avoid truncating valid content like code blocks and lists
      // Rely on max_tokens and post-processing cleanup instead
    });
    
    console.log('Raw AI response received');
    
    // Try to extract the response text
    let responseText;
    
    // Based on Cloudflare's documentation for the model
    if (typeof aiResponse === 'string') {
      // Direct string response
      responseText = aiResponse;
      console.log('Response is a string');
    } else if (typeof aiResponse === 'object' && aiResponse !== null) {
      // If response is directly the text
      if (typeof aiResponse.response === 'string') {
        responseText = aiResponse.response;
        console.log('Response found in .response property');
      }
      // If response is in a specific format used by this model
      else if (typeof aiResponse.text === 'string') {
        responseText = aiResponse.text;
        console.log('Response found in .text property');
      } 
      // Another possible format
      else if (typeof aiResponse.content === 'string') {
        responseText = aiResponse.content;
        console.log('Response found in .content property');
      }
      // Last resort - stringify the object
      else {
        responseText = JSON.stringify(aiResponse);
        console.log('Response format unknown, stringifying entire object');
      }
    } else {
      responseText = "Received an unexpected response type.";
      console.error('Unexpected response type:', typeof aiResponse);
    }
    
    // Clean up the response text formatting
    responseText = cleanupFormatting(responseText);
    
    // Log AI response summary (avoid full content logging in production)
    if (env.DEBUG) {
      console.log('AI Response (Pre-Deduplication):', responseText.substring(0, 100) + '...');
    }

    // Apply our enhanced deduplication function
    responseText = deduplicateResponse(responseText);

    if (env.DEBUG) {
      console.log('Final extracted response text (Post-Deduplication):', responseText.substring(0, 100) + '...');
    }
    
    // If we used Wikipedia, add a citation
    if (wikipediaInfo && wikipediaInfo.success && wikipediaInfo.url && wikipediaInfo.title) {
      // Check if the response doesn't already contain the citation URL
      if (!responseText.includes(wikipediaInfo.url)) {
        const cleanUrl = wikipediaInfo.url.replace(/\s+/g, '');
        // Also check if the title seems reasonable (not a placeholder or error)
        if (wikipediaInfo.title.toLowerCase() !== "no wikipedia articles found for this query." && 
            wikipediaInfo.title.length > 0 && 
            !responseText.toLowerCase().includes(wikipediaInfo.title.toLowerCase())) { // Avoid re-adding if title already mentioned
        responseText += `\n\nSource: [Wikipedia - ${wikipediaInfo.title}](${cleanUrl})`;
        }
      }
    }
    
    // Store the response in the cache
    memoryCache.set(cacheKey, responseText);

    // Also store in KV cache if available
    if (kvCache.set) {
      await kvCache.set(cacheKey, responseText);
    }
    
    return responseText;
  } catch (error) {
    console.error('Error in sendToAI:', error);
    // More detailed error information
    if (error.stack) {
      console.error('Error stack:', error.stack);
    }
    if (error.message) {
      console.error('Error message:', error.message);
    }
    return "Sorry, I had trouble processing your request. Error: " + error.message;
  }
}

// Function to handle request
export default {
  async fetch(request, env) {
    // Initialize KV cache if available
    // Note: KV binding is commented out in wrangler.toml, so this won't run
    // Uncomment and add real KV namespace ID when ready to enable KV caching
    // if (env && env.KV) {
    //   await initializeKVCache(env);
    // }

    const url = new URL(request.url);
    // Function to validate origin against allowlist
    function isOriginAllowed(origin, allowedOrigins = []) {
      if (!origin) return false;

      // For a live chat widget, allow all origins by default
      // In production, this could be made configurable per tenant
      return true;
    }

    // Function to validate request origin for API routes
    function validateApiRequestOrigin(request, allowedOrigins = []) {
      const origin = request.headers.get('Origin');
      const referer = request.headers.get('Referer');

      // For API routes, we need to validate the origin
      if (request.url.includes('/api/')) {
        // Check Origin header first
        if (origin && isOriginAllowed(origin, allowedOrigins)) {
          return origin;
        }

        // Fallback to Referer header (some older browsers or specific setups)
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

        // If no valid origin found, reject the request
        return null;
      }

      return origin && isOriginAllowed(origin, allowedOrigins) ? origin : null;
    }

    // Get validated origin for CORS
    const requestOrigin = validateApiRequestOrigin(request);
    const corsHeaders = {
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Origin': '*', // Allow all origins for live chat widget
    };

    // Handle CORS preflight requests first (quick return)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // Enhanced Rate Limiting Logic - Support for both IP and customer-level throttling
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown_ip';
    let rateLimitExceeded = false;
    let retryAfterSeconds = 60; // Default retry after time

    // Extract customer identifier (API key, tenant ID, etc.)
    const customerKey = request.headers.get('Authorization')?.replace('Bearer ', '') ||
                       request.headers.get('X-API-Key') ||
                       url.searchParams.get('api_key') ||
                       'anonymous';

    // Start rate limiting check in background
    const rateLimitPromise = (async () => {
      if (!env.RATE_LIMITER_KV) {
        return false;
      }

      try {
        const now = Date.now();
        const currentMinute = Math.floor(now / 60000);
        const nextMinute = currentMinute + 1;
        const secondsUntilNextMinute = (nextMinute * 60000 - now) / 1000;

        // Check IP-based rate limit (existing logic)
        let ipRequestCount = 0;
        if (clientIP !== 'unknown_ip') {
          const ipKey = `rate_limit:ip:${clientIP}:${currentMinute}`;
          const ipCount = await env.RATE_LIMITER_KV.get(ipKey);
          ipRequestCount = ipCount ? parseInt(ipCount) : 0;

          if (ipRequestCount >= 100) {
            rateLimitExceeded = true;
            console.log(`IP rate limit exceeded for ${clientIP}. Count: ${ipRequestCount}`);
            retryAfterSeconds = Math.ceil(secondsUntilNextMinute);
            return true;
          }
        }

        // Check customer-based rate limit (new feature)
        const customerRateLimitKey = `rate_limit:customer:${customerKey}:${currentMinute}`;
        const customerCount = await env.RATE_LIMITER_KV.get(customerRateLimitKey);
        const customerRequestCount = customerCount ? parseInt(customerCount) : 0;

        // Customer limit is lower than IP limit to prevent abuse per API key
        if (customerRequestCount >= 30) {
          rateLimitExceeded = true;
          console.log(`Customer rate limit exceeded for ${customerKey}. Count: ${customerRequestCount}`);
          retryAfterSeconds = Math.ceil(secondsUntilNextMinute);
          return true;
        }

        // Increment both counters in the background (don't await)
        const incrementPromises = [];

        // Increment IP counter
        if (clientIP !== 'unknown_ip') {
          const ipKey = `rate_limit:ip:${clientIP}:${currentMinute}`;
          incrementPromises.push(
            env.RATE_LIMITER_KV.put(ipKey, (ipRequestCount + 1).toString(), { expirationTtl: 60 })
              .catch(e => console.error('IP rate limiter increment error:', e))
          );
        }

        // Increment customer counter
        incrementPromises.push(
          env.RATE_LIMITER_KV.put(customerRateLimitKey, (customerRequestCount + 1).toString(), { expirationTtl: 60 })
            .catch(e => console.error('Customer rate limiter increment error:', e))
        );

        // Execute increments without waiting
        incrementPromises.forEach(promise => promise.catch(() => {}));

        return false;
      } catch (e) {
        console.error('Rate limiter KV error:', e);
        return false;
      }
    })();
    
    try {
      // Quick path for static assets with no-cache headers (ensure latest during dev and embed)
      if (url.pathname === '/widget.js') {
        return new Response(generateWidgetJS(url.origin), {
          headers: { 
            'Content-Type': 'application/javascript',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            ...corsHeaders
          }
        });
      }
      
      if (url.pathname === '/widget-iframe') {
        return new Response(generateWidgetHTML(url), {
          headers: { 
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            ...corsHeaders
          }
        });
      }
      
      // For API endpoints, check rate limit and origin validation before proceeding
      if (url.pathname.startsWith('/api/')) {
        // Validate origin for API requests to block direct abuse
        if (!requestOrigin) {
          return new Response(JSON.stringify({ error: 'Origin not allowed' }), {
            status: 403,
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }

        // Wait for rate limit check to complete
        const isRateLimited = await rateLimitPromise;
        if (isRateLimited) {
          return new Response(JSON.stringify({ error: 'Too Many Requests' }), {
            status: 429,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
              'Retry-After': retryAfterSeconds.toString()
            }
          });
        }
      }
      
      // Handle chat API requests
      if (url.pathname === '/api/chat' && request.method === 'POST') {
        const body = await request.json();
        const message = body.message;
        let history = body.history || [];
        
        if (!message) {
          return new Response(JSON.stringify({ error: 'No message provided' }), {
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }

        // --- History Trimming ---
        const MAX_HISTORY_LENGTH = 10; // Keep the last 5 exchanges (10 messages)
        if (history.length > MAX_HISTORY_LENGTH) {
          history = history.slice(history.length - MAX_HISTORY_LENGTH);
        }
        
        // --- Prepare messages array for the AI ---
        const messages = [
          { role: 'system', content: getSystemPrompt() } // Use cached prompt
        ];

        // Add history messages if available
        if (history.length > 0) {
          messages.push(...history);
        }
        
        // Add the current user message
        messages.push({ role: 'user', content: message });
        
        // Send to Cloudflare AI
        const aiResponse = await sendToAI(messages, env);
        
        return new Response(JSON.stringify({ response: aiResponse }), {
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
      
      // Handle welcome message request
      if (url.pathname === '/api/welcome-message' && request.method === 'GET') {
        try {
          // Create a simple welcome message using the AI
          const messages = [
            { role: 'system', content: getSystemPrompt() + '\n\nPlease provide a brief, friendly welcome message introducing yourself as FREA, the AI assistant. Keep it concise and engaging.' }
          ];

          const welcomeMessage = await sendToAI(messages, env);

          return new Response(JSON.stringify({ message: welcomeMessage }), {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        } catch (error) {
          console.error('Error generating welcome message:', error);
          return new Response(JSON.stringify({ error: 'Failed to generate welcome message' }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }
      }

      // Handle cache stats request (for debugging)
      if (url.pathname === '/api/cache-stats' && request.method === 'GET') {
        const stats = getMemoryCacheStats();
        return new Response(JSON.stringify(stats), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
      
      // For root path, serve simple instructions
      return new Response(`
<!DOCTYPE html>
<html>
<head>
  <title>Live Chat Widget</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>Live Chat Widget</h1>
  <p>To use the widget, add this script tag to your website:</p>
  <pre><code>&lt;script src="${url.origin}/widget.js"&gt;&lt;/script&gt;</code></pre>
  <p>For more information, visit the <a href="https://github.com/1999AZZAR/live-chat-widget">GitHub repository</a>.</p>
</body>
</html>`, {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          ...corsHeaders
        }
      });
    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ error: 'An error occurred', message: error.message }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
}

 

