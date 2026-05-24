# Live Chat Widget – Product & Engineering Roadmap

This document lists concrete, prioritized improvements to make the widget more reliable, secure, scalable, and production-ready. Tasks are grouped by priority and area. Use this as the single source of truth for planning and execution.

Legend: [ ] todo, [~] in-progress, [x] done

## P0 — Critical correctness, stability, and security

- [x] Fix undocumented/missing endpoints vs docs
  - [x] Implement `GET /api/welcome-message` (documented in `README.md` but not implemented in `src/index.js`).
- [ ] Bindings and config parity
  - [x] Add a dedicated KV namespace for response cache (code expects `env.KV`; `wrangler.toml` only defines `SYSTEM_PROMPT` and `RATE_LIMITER_KV`).
  - [x] Create real KV namespace and replace placeholder ID in `wrangler.toml` to enable KV caching.
  - [ ] Use `SYSTEM_PROMPT` KV to source dynamic persona configuration.
- [x] XSS hardening for AI markdown rendering
  - [x] Escape/sanitize HTML before regex markdown transforms in `iframe-generator.js` (`markdownToHtml`).
  - [x] Add allowlist for links; strip scripts/data URIs; consider a lightweight sanitizer.
- [x] CORS and embed hardening
  - [x] Replace `Access-Control-Allow-Origin: *` with allowlist of permitted origins for API routes.
  - [x] Validate `Origin`/`Referer` on `/api/*` to block direct abuse.
- [x] Rate limiting resilience
  - [x] Add API key throttles in addition to IP (`RATE_LIMITER_KV`).
  - [x] Return precise `Retry-After` seconds based on window remainder.
- [x] Logging hygiene
  - [x] Guard verbose logs behind `DEBUG` flag; avoid logging full message bodies in production.
- [x] Model stop sequences sanity
  - [x] Revisit `stop_sequences: ['\n\n', ']', '```']` to avoid truncating valid content (e.g., code blocks, lists).

## P1 — Configuration

- [ ] Widget Authentication & Security
  - [ ] Support optional API key protection on `/api/*`.
- [ ] Config storage
  - [ ] Use `SYSTEM_PROMPT` KV for easy updates to persona/system prompt and knowledge equivalents without redeploying.
  - [ ] Set theme defaults, language fallback, model, and temperature via `wrangler.toml` vars.
- [ ] Setup UX
  - [ ] Generate unique embed snippet including SRI and version pin.

## P1 — Reliability and performance

- [ ] Cache strategy
  - [ ] Use KV for durable response caching per `(system, trimmed history, last user)`; memory LRU remains as hot cache.
  - [ ] Add TTL tuning by content length; optionally cache Wikipedia summaries per language for 24h.
- [ ] Streaming responses (UX + cost control)
  - [ ] Implement server streaming from Cloudflare AI (if supported) and incremental render in iframe.
  - [ ] Typing indicator transitions to streamed text.
- [ ] Wikipedia integration
  - [ ] Localize queries based on detected language; fallback to English on miss.
  - [ ] Add TTL and failure backoff; store minimal payloads.
- [ ] Token budget accuracy
  - [ ] Replace heuristic with Cloudflare token usage (when exposed) or safer margins per model.

## P1 — Security and compliance

- [ ] Content Security Policy for iframe
  - [ ] Add strict CSP in iframe HTML (`default-src 'none'; style-src 'unsafe-inline'; img-src data: https:; connect-src 'self' https:`). Adjust as needed for fonts.
- [ ] Iframe sandboxing
  - [ ] Add `sandbox` and narrow `allow` attributes on the embed iframe.
- [ ] Abuse prevention
  - [ ] Optional Turnstile challenge for high-risk IP or burst traffic.
- [ ] Data handling
  - [ ] Configurable redaction of PII in logs; add Data Processing Notes in docs.

## P2 — Developer Experience (DX) and quality

- [ ] TypeScript migration (Workers-compatible ESM)
  - [ ] Add tsconfig, ESLint, Prettier; incremental TS on `src/`.
- [ ] Tests
  - [ ] Unit tests for LRU cache, wiki helper, deduplication.
  - [ ] Integration tests using Miniflare or Wrangler local; basic e2e for widget boot and chat.
- [ ] CI/CD
  - [ ] GitHub Actions: lint, test, preview deploy; wrangler publish on tagged release.
- [ ] Error boundaries
  - [ ] Centralize error responses; consistent JSON schema with error codes.
- [ ] Observability
  - [ ] Structured logs (requestId, route, latency). Optional Sentry/HyperDX.

## P2 — Product and UX

- [ ] Accessibility (a11y)
  - [ ] Keyboard navigation, focus states, aria labels; reduce-motion preferences.
- [ ] Shadow DOM isolation for launcher button
  - [ ] Create shadow root to reduce host CSS collisions (iframe already isolates chat window).
- [ ] Theming performance
  - [ ] Make advanced theme detection opt-in; default to simple heuristics; avoid heavy layout thrash.
- [ ] Offline and retries
  - [ ] Detect network errors; show retry UI; exponential backoff.
- [ ] Conversation persistence controls
  - [ ] Configurable history retention in `localStorage` and a “clear on close” option.

## P2 — Documentation parity and examples

- [ ] Keep `README.md` and `API.md` in sync with code
  - [ ] Add the missing `GET /api/welcome-message` description once implemented.
- [ ] Add code samples
  - [ ] React/Next.js wrapper; plain HTML example; SPA router caveats.
- [ ] Admin/ops docs
  - [ ] Instructions for setting KV namespaces, analytics, and origin allowlists.

## P3 — Roadmap (nice-to-have / strategic)

- [ ] Model routing
  - [ ] Configurable model selection and automatic fallback on errors.
- [ ] Analytics
  - [ ] Cloudflare Analytics Engine or Logs-based events (open, send, token usage, errors) with privacy.
- [ ] Cost controls
  - [ ] Daily/monthly token usage caps; graceful degrade to smaller model.
- [ ] RAG hooks
  - [ ] Pluggable knowledge sources (KV/D1/R2) with dynamic indexing.
- [ ] Export/transcript
  - [ ] Allow user to export conversation as text/markdown.

---

## Concrete implementation checklist (first passes)

1) Correctness & security (ship immediately)
- [x] Implement `GET /api/welcome-message` in `src/index.js` and wire to persona + language.
- [x] Add a new KV binding `RESPONSE_CACHE_KV` in `wrangler.toml` and use it in `sendToAI`.
- [x] Sanitize AI output in `markdownToHtml` before formatting.
- [x] Replace `*` CORS with origin allowlist; validate `Origin`/`Referer` for `/api/*`.

2) Configuration MVP
- [x] Add API keys; validate on `/widget.js` and `/api/*` via query/header.
- [x] Persist dynamic config + persona in `SYSTEM_PROMPT` KV.

3) Performance & UX
- [ ] KV-backed cache with configurable TTL; keep memory LRU hot cache.
- [ ] (Optional) Streaming responses and incremental render.
- [ ] Make advanced theme detection opt-in; default to lightweight detection.

4) DX & QA
- [ ] Add ESLint/Prettier; set up CI with lint/test; migrate critical files to TS.
- [ ] Miniflare integration tests for `/api/chat`, `/widget.js`, `/widget-iframe`.

5) Observability
- [ ] Add structured logs with requestId and latency metrics; optional Sentry.

---

## Notes from current code audit

- `README.md` documents `GET /api/welcome-message`, but handler is missing.
- `wrangler.toml` defines `AI`, `SYSTEM_PROMPT`, `RATE_LIMITER_KV`; no generic `KV` used by `sendToAI` cache wrapper.
- Markdown rendering currently does not escape HTML; potential XSS if model outputs HTML.
- `stop_sequences` likely too aggressive and may truncate valid content.
- Theming detector includes a `drawWindow` attempt (non-standard); it’s wrapped in try/catch, but we should avoid heavy operations by default.
- Persona and knowledge resources are static files; move to KV for dynamic updates.
- CORS is `*`; switch to configurable allowlist.
files; move to KV for dynamic updates.
- CORS is `*`; switch to configurable allowlist.
