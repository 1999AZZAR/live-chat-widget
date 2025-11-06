# Azzar AI Chat Widget

An embeddable AI chat widget powered by Cloudflare Workers and Llama 3.1. The widget provides a personalized AI assistant experience with intelligent theming, Wikipedia integration, and customizable persona.

## Features

- **Personalized AI:** Customize the AI's persona, knowledge, and tone by editing the `src/systemInstruction.txt` file.
- **Wikipedia Integration:** Provides accurate, summarized answers to factual questions by dynamically querying Wikipedia when appropriate.
- **Response Deduplication:** Processes AI responses to remove repetitive phrases and ensure concise output.
- **Intelligent Theming:** Automatically adapts to website design through multiple detection methods including CSS variables, background colors, and framework detection.
- **Modern Interface:** Clean, responsive, mobile-friendly design with glassmorphic effects.
- **Rate Limiting:** Protects the API from abuse with IP and customer-based rate limiting.
- **Simple Integration:** Add to any website with a single script tag.
- **Language Support:** Automatic language detection with support for English and Bahasa Indonesia.
- **Caching:** Intelligent caching system for improved performance and reduced API costs.

## Installation

To use the widget, you need to deploy it as a Cloudflare Worker. The deployment process requires Wrangler CLI.

### Prerequisites

- Node.js 16 or later
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare account with Workers enabled

### Deployment Steps

1. **Clone and Install:**
   ```bash
   git clone https://github.com/1999AZZAR/live-chat-widget.git
   cd live-chat-widget
   npm install
   ```

2. **Configure Wrangler:**
   ```bash
   wrangler auth login
   wrangler config
   ```

3. **Deploy the Worker:**
   ```bash
   npm run deploy
   ```
   This command will deploy your worker and provide a URL (e.g., `https://your-worker-name.your-account.workers.dev`).

4. **Embed the Widget:**
   Add the following script tag to your website's HTML, replacing `<your-worker-url>` with the deployment URL:

   ```html
   <script src="https://<your-worker-url>/widget.js"></script>
   ```

   The widget will automatically appear in the bottom-right corner and adapt to your site's theme.

## Run locally

You can run the worker locally with Wrangler and test the widget on a simple HTML page.

1. Start the dev server:

   ```bash
   # Using npm scripts (recommended)
   npm install
   npm run dev

   # Or explicitly run fully local (no Cloudflare edge services)
   npm run dev -- --local
   ```

   Or use npx directly (no local install required):

   ```bash
   npx wrangler dev            # remote dev (recommended for AI binding)
   npx wrangler dev --local    # local-only runtime
   ```

   Notes:
   - Remote dev (default without `--local`) is recommended because it supports Cloudflare AI and KV bindings defined in `wrangler.toml`. The chat will work end-to-end.
   - Local mode (`--local`) is great for UI/theming testing, but AI responses may not work if the AI binding isn't available locally.

   Wrangler will print a local URL like `http://127.0.0.1:8787`.

2. Create a minimal test page (e.g., `local-test.html`) and point the script to your local worker URL:

   ```html
   <!doctype html>
   <html>
   <head>
     <meta charset="utf-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1" />
     <title>Widget Local Test</title>
     <!-- Optional Tailwind CDN to try Tailwind/DaisyUI detection -->
     <script src="https://cdn.tailwindcss.com"></script>
   </head>
   <body class="min-h-screen bg-gray-50 p-8">
     <h1 class="text-2xl font-bold mb-4">Azzar AI Chat Widget - Local Test</h1>
     <p class="mb-8">This page loads the widget from your local Cloudflare Worker.</p>

     <!-- Load widget from local worker; add data-color to force theme if needed -->
     <script src="http://127.0.0.1:8787/widget.js" data-color="auto"></script>
   </body>
   </html>
   ```

3. Open the file in your browser (double-click or serve it with any static server). The widget should appear in the bottom-right and talk to the local worker. Try toggling Tailwind classes (e.g., add `class="dark"` to `html`) to see color/theme detection in action.

4. Test the API directly (optional):

   ```bash
   curl -X POST http://127.0.0.1:8787/api/chat \
     -H 'Content-Type: application/json' \
     -d '{"message":"Hello"}'
   ```

### Common npm/npx commands

- **Start dev (remote, with bindings):**
  ```bash
  npm run dev
  # or
  npx wrangler dev
  ```
- **Start dev (local runtime):**
  ```bash
  npm run dev -- --local
  # or
  npx wrangler dev --local
  ```
- **Deploy to Cloudflare:**
  ```bash
  npm run deploy
  # or
  npx wrangler deploy
  ```

## Theming & Customization

The widget intelligently determines its theme by checking sources in a specific order of priority. This allows for flexible and powerful customization.

### Theme Priority

1.  **`data-color` Attribute (Highest Priority):**
    You can force a specific theme by adding the `data-color` attribute to the script tag. This is the easiest and most direct way to set a theme.
    -   Force dark mode:
        ```html
        <script src=".../widget.js" data-color="dark"></script>
        ```
    -   Force light mode:
        ```html
        <script src=".../widget.js" data-color="light"></script>
        ```

2.  **Host Page Theme Detection (Automatic):**
    If `data-color` is not set, the widget attempts to detect the theme from your website's existing styles. It looks for:
    -   **Background Color of Major Containers:** Inspects visible `main`, `#root`, `#app`, `#__next`, etc. to determine light/dark based on luminance.
    -   **CSS Variables:** Reads standard CSS variables like `--primary-color`, `--background`, `--text-color`, etc., to match your site's branding.
    -   **Tailwind/DaisyUI Support:**
        - Detects Tailwind `dark` mode class on `html`/`body`.
        - Picks non-neutral Tailwind colors from elements with `bg-*` or `text-*` classes.
        - Probes DaisyUI `btn btn-primary` to infer `primary-color` and `on-primary`.
    -   **Inferred Styles:** If variables aren't present, it infers colors from prominent elements like buttons and links.

3.  **OS Preference (Fallback):**
    If no theme can be determined from the methods above, the widget will fall back to the user's operating system preference (`prefers-color-scheme`).

### Customizing with CSS Variables

For seamless integration, define CSS variables in your site's stylesheet. The widget automatically detects and uses these variables.

| CSS Variable       | Description                                  | Default |
| ------------------ | -------------------------------------------- | ------- |
| `--primary-color`  | Main accent color for buttons and user messages | Auto-detected |
| `--on-primary`     | Text color for elements with primary background | Auto-calculated |
| `--background`     | Chat window background color                 | Auto-detected |
| `--text-color`     | Primary text color                           | Auto-detected |
| `--border-radius`  | Border radius for bubbles and inputs         | 12px |
| `--font-family`    | Font family for widget text                  | System font |

**Example:**
```css
:root {
  --primary-color: #007bff;
  --on-primary: #ffffff;
  --background: #f8f9fa;
  --text-color: #212529;
  --border-radius: 12px;
  --font-family: 'Inter', sans-serif;
}
```

### Framework-Specific Theming

The widget includes special detection for popular frameworks:

**Tailwind CSS:**
- Detects `bg-*` and `text-*` classes for color inference
- Recognizes `dark:` mode classes
- Automatically switches between light and dark themes

**DaisyUI:**
- Probes for `btn btn-primary` elements to detect primary colors
- Inherits color scheme from DaisyUI components

### Manual Theme Control

For precise control, use the `data-color` attribute:

```html
<!-- Force light theme -->
<script src="/widget.js" data-color="light"></script>

<!-- Force dark theme -->
<script src="/widget.js" data-color="dark"></script>

<!-- Auto-detect (default) -->
<script src="/widget.js" data-color="auto"></script>
```

## Language Detection

The widget automatically detects the language to use for its welcome message by checking in this order:

1.  **`window.AZZAR_CHAT_CONFIG.lang`**: A globally defined JavaScript variable.
2.  **`<script data-azzar-lang="...">`**: An attribute on the script tag.
3.  **`<html lang="...">`**: The `lang` attribute of your HTML tag.
4.  **`navigator.language`**: The browser's default language setting.

You can also change the language dynamically at any time by calling `window.azzarChatSetLang('your-lang-code')`.

## API Reference

The widget provides several endpoints for integration and monitoring.

### Core Endpoints

- **`GET /widget.js`**: Serves the main widget script for embedding
- **`GET /widget-iframe`**: Serves the iframe content for the chat interface
- **`POST /api/chat`**: Main chat endpoint for sending messages
- **`GET /api/welcome-message`**: Generates and returns an AI welcome message
- **`GET /api/cache-stats`**: Returns statistics about the LRU cache performance

### Chat API

Send a POST request to `/api/chat` with the following JSON payload:

```json
{
  "message": "User message here",
  "history": [
    {"role": "user", "content": "Previous user message"},
    {"role": "assistant", "content": "Previous AI response"}
  ]
}
```

**Response:**
```json
{
  "response": "AI response text"
}
```

### Configuration Options

#### Language Configuration

Set language through multiple methods:

1. **Global Variable:**
   ```javascript
   window.AZZAR_CHAT_CONFIG = { lang: 'id' };
   ```

2. **Script Attribute:**
   ```html
   <script src="/widget.js" data-azzar-lang="id"></script>
   ```

3. **HTML Lang Attribute:**
   ```html
   <html lang="id">
   ```

4. **Runtime Change:**
   ```javascript
   window.azzarChatSetLang('id');
   ```

#### Rate Limiting

The API implements dual-layer rate limiting:
- **IP-based**: 100 requests per minute per IP
- **Customer-based**: 30 requests per minute per API key

Rate limit headers are included in responses:
- `X-RateLimit-Remaining`: Remaining requests
- `Retry-After`: Seconds until reset (when exceeded)

### Caching System

The widget uses a multi-level caching system:

- **Memory Cache**: Fast LRU cache for recent conversations
- **KV Cache**: Persistent cache for frequently accessed data
- **Response Deduplication**: Prevents repetitive AI responses

Cache statistics available at `/api/cache-stats`.

## Customization

### AI Persona

To customize the AI's personality, knowledge, and behavior:

1. Edit the `src/systemInstruction.txt` file with your desired persona details
2. Deploy changes: `npm run deploy`

The AI will use the new persona for all conversations. The persona file includes:
- Personality traits and communication style
- Technical expertise and knowledge areas
- Response guidelines and limitations

### Rate Calculation (for FREA)

The AI includes built-in knowledge of Azzar's rate calculation methodology:
- Hourly rates from $20-$35 based on project size
- Consultation fees ($70-$120) every 30 hours
- Payment plans with 2-3 installment options
- Multi-currency support with real-time conversion

## Development

### Project Structure

```
src/
├── index.js              # Main Cloudflare Worker
├── systemInstruction.txt # AI persona and knowledge
├── widget-generator.js   # Client-side widget script
├── iframe-generator.js   # Chat interface HTML
├── lru-handler.js        # Caching system
└── crawl.txt            # Additional resources
```

### Local Development

Start the development server:

```bash
# With full Cloudflare integration
npm run dev

# Local-only mode (no AI/KV)
npm run dev -- --local
```

### Testing

Create a test page:

```html
<!DOCTYPE html>
<html>
<body>
  <script src="http://127.0.0.1:8787/widget.js"></script>
</body>
</html>
```

Test the API directly:
```bash
curl -X POST http://127.0.0.1:8787/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'
```

## Performance Optimization

### Caching Strategy

The widget uses multiple caching layers:
- **LRU Memory Cache**: Recent conversations (1 hour TTL)
- **KV Cache**: Persistent storage for API responses
- **Response Deduplication**: Prevents repetitive AI output

### Rate Limiting

Dual-layer protection:
- IP-based: 100 requests/minute
- Customer-based: 30 requests/minute per API key

### Bundle Size

The widget is optimized for fast loading:
- Gzipped widget.js: ~35KB
- Minimal external dependencies
- Lazy-loaded components

## Security

### API Security

- Origin validation for API endpoints
- Rate limiting prevents abuse
- CORS headers for cross-origin requests
- Input sanitization and validation

### Data Privacy

- No persistent storage of chat history
- Anonymous usage analytics only
- Compliant with privacy regulations
- No third-party tracking

## Troubleshooting

### Widget Not Loading

1. Check browser console for errors
2. Verify script URL is correct
3. Ensure HTTPS in production
4. Check CORS headers if using custom domain

### AI Not Responding

1. Verify Cloudflare AI binding is configured
2. Check rate limits haven't been exceeded
3. Review systemInstruction.txt for persona issues
4. Check KV namespace configuration

### Theming Issues

1. Verify CSS variables are defined in `:root`
2. Check for conflicting styles
3. Use `data-color` attribute for manual control
4. Test with different browsers

### Language Detection

1. Set HTML `lang` attribute
2. Use `data-azzar-lang` script attribute
3. Check `navigator.language` fallback
4. Use `window.azzarChatSetLang()` for runtime changes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm run dev`
5. Submit a pull request

## License

This project is open source. See LICENSE file for details. 