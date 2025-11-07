# Live Chat Widget

An embeddable AI chat widget powered by Cloudflare Workers and Llama 3.1. The widget provides a personalized AI assistant experience with intelligent theming, Wikipedia integration, and customizable persona.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Deployment Steps](#deployment-steps)
- [Run Locally](#run-locally)
  - [Common npm/npx Commands](#common-npmnpx-commands)
- [Theming & Customization](#theming--customization)
  - [Theme Priority](#theme-priority)
  - [Customizing with CSS Variables](#customizing-with-css-variables)
  - [Framework-Specific Theming](#framework-specific-theming)
  - [Manual Theme Control](#manual-theme-control)
- [Language Detection](#language-detection)
- [API Reference](#api-reference)
  - [Core Endpoints](#core-endpoints)
  - [Chat API](#chat-api)
  - [Configuration Options](#configuration-options)
  - [Caching System](#caching-system)
- [Customization](#customization)
  - [AI Persona](#ai-persona)
  - [Rate Calculation](#rate-calculation-for-frea)
- [Development](#development)
  - [Project Structure](#project-structure)
  - [Local Development](#local-development)
  - [Testing](#testing)
- [Performance Optimization](#performance-optimization)
  - [Caching Strategy](#caching-strategy)
  - [Rate Limiting](#rate-limiting)
  - [Bundle Size](#bundle-size)
- [Security](#security)
  - [API Security](#api-security)
  - [Data Privacy](#data-privacy)
- [Troubleshooting](#troubleshooting)
  - [Widget Not Loading](#widget-not-loading)
  - [AI Not Responding](#ai-not-responding)
  - [Theming Issues](#theming-issues)
  - [Language Detection](#language-detection-issues)
- [Frequently Asked Questions](#frequently-asked-questions)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

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

To use the widget, you need to deploy it as a Cloudflare Worker. The deployment process requires Wrangler CLI and takes approximately 5-10 minutes to complete.

### Prerequisites

Before starting, ensure you have the following:

- **Node.js:** Version 16 or later (check with `node --version`)
- **npm:** Included with Node.js (check with `npm --version`)
- **Wrangler CLI:** Cloudflare's command-line tool for Workers
- **Cloudflare Account:** With Workers enabled
- **Git:** For cloning the repository

### System Requirements

- **Operating System:** Linux, macOS, or Windows (with WSL)
- **RAM:** Minimum 512MB available
- **Storage:** 200MB free space
- **Network:** Stable internet connection for deployment

### Installation Steps

#### 1. Install Wrangler CLI

Install Wrangler globally using npm:

```bash
npm install -g wrangler
```

Verify installation:
```bash
wrangler --version
```

#### 2. Clone Repository

Clone the project repository and navigate to the directory:

```bash
git clone https://github.com/1999AZZAR/live-chat-widget.git
cd live-chat-widget
```

#### 3. Install Dependencies

Install project dependencies:

```bash
npm install
```

This will install all required packages including Wrangler and development dependencies.

#### 4. Authenticate with Cloudflare

Login to your Cloudflare account:

```bash
wrangler auth login
```

This will open your browser for authentication. Follow the prompts to complete the login process.

#### 5. Configure Project (Optional)

If you need to modify the default configuration, edit `wrangler.toml`:

```toml
name = "live-chat-widget"
main = "src/index.js"
workers_dev = true
compatibility_date = "2025-05-14"
```

#### 6. Deploy to Cloudflare

Deploy the worker to Cloudflare's edge network:

```bash
npm run deploy
```

The deployment process will:
- Bundle your code and dependencies
- Upload to Cloudflare's servers
- Configure the worker with the specified bindings
- Provide a deployment URL

Upon successful deployment, you'll receive a URL like:
```
https://live-chat-widget.your-account.workers.dev
```

### Embedding the Widget

After deployment, add the widget to your website by including a single script tag in your HTML:

#### Basic Implementation

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Website</title>
</head>
<body>
    <!-- Your website content -->

    <!-- Live Chat Widget -->
    <script src="https://live-chat-widget.your-account.workers.dev/widget.js"></script>
</body>
</html>
```

#### Advanced Implementation with Theme Control

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Website</title>

    <!-- Define CSS variables for theming -->
    <style>
        :root {
            --primary-color: #007bff;
            --background: #ffffff;
            --text-color: #333333;
            --border-radius: 12px;
        }

        /* Dark mode variables */
        @media (prefers-color-scheme: dark) {
            :root {
                --primary-color: #4dabf7;
                --background: #1a1a1a;
                --text-color: #ffffff;
            }
        }
    </style>
</head>
<body>
    <!-- Your website content -->

    <!-- Live Chat Widget with forced light theme -->
    <script src="https://live-chat-widget.your-account.workers.dev/widget.js" data-color="light"></script>
</body>
</html>
```

### Verification

After embedding, verify the widget is working:

1. **Visual Check:** Look for the chat bubble in the bottom-right corner of your page
2. **Console Check:** Open browser developer tools and check for any JavaScript errors
3. **Functionality Test:** Click the chat bubble and send a test message

### Troubleshooting Installation

If the widget doesn't appear:

1. **Check Script URL:** Ensure the script `src` attribute points to your deployed worker URL
2. **Verify Deployment:** Confirm the worker deployed successfully and is accessible
3. **Browser Cache:** Clear browser cache and reload the page
4. **Console Errors:** Check browser developer tools for JavaScript errors

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
     <h1 class="text-2xl font-bold mb-4">Live Chat Widget - Local Test</h1>
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

The project follows a modular architecture designed for Cloudflare Workers:

```
live-chat-widget/
├── src/
│   ├── index.js              # Main Cloudflare Worker entry point
│   ├── systemInstruction.txt # AI persona configuration and knowledge base
│   ├── widget-generator.js   # Client-side widget JavaScript generation
│   ├── iframe-generator.js   # Chat interface HTML generation
│   ├── lru-handler.js        # LRU cache implementation with KV storage
│   └── crawl.txt            # Additional resources and configuration
├── wrangler.toml            # Cloudflare Workers configuration
├── package.json             # Node.js dependencies and scripts
├── API.md                   # API documentation
└── README.md               # Project documentation
```

### Key Components

#### Core Files

- **`src/index.js`**: Main worker logic handling routing, rate limiting, and API endpoints
- **`src/systemInstruction.txt`**: Defines the AI assistant's personality, knowledge, and behavior
- **`wrangler.toml`**: Configuration for Cloudflare Workers bindings and deployment settings

#### Client-Side Components

- **`src/widget-generator.js`**: Generates the embeddable JavaScript for websites
- **`src/iframe-generator.js`**: Creates the chat interface HTML and styling

#### Utilities

- **`src/lru-handler.js`**: Implements caching with memory and KV storage layers
- **`src/crawl.txt`**: Contains additional resources and configuration data

### Environment Variables

The worker uses the following environment variables and bindings:

#### Cloudflare Bindings

| Binding | Type | Purpose |
|---------|------|---------|
| `AI` | AI | Llama 3.1 model for chat responses |
| `SYSTEM_PROMPT` | KV | Persistent storage for system prompts |
| `RATE_LIMITER_KV` | KV | Rate limiting data storage |

#### Configuration Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DEBUG` | `false` | Enable debug logging and additional error information |

### Local Development

#### Development Modes

The project supports two development modes:

**Remote Mode (Recommended):**
```bash
npm run dev
```
- Full Cloudflare integration with AI and KV bindings
- End-to-end functionality testing
- Requires active internet connection

**Local Mode:**
```bash
npm run dev -- --local
```
- Runs without Cloudflare services
- Useful for UI testing and development
- AI responses will not work

#### Development Workflow

1. **Start Development Server:**
   ```bash
   npm run dev
   ```

2. **Access Local Worker:**
   - Worker URL: `http://127.0.0.1:8787`
   - Widget script: `http://127.0.0.1:8787/widget.js`

3. **Test with Sample Page:**
   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <title>Widget Test</title>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
   </head>
   <body>
       <h1>Live Chat Widget Test</h1>
       <script src="http://127.0.0.1:8787/widget.js"></script>
   </body>
   </html>
   ```

### Testing

#### API Testing

Test the chat endpoint directly:

```bash
# Simple message test
curl -X POST http://127.0.0.1:8787/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello, how are you?"}'

# Test with conversation history
curl -X POST http://127.0.0.1:8787/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message":"What is your name?",
    "history":[
      {"role":"user","content":"Hello"},
      {"role":"assistant","content":"Hello! How can I help you today?"}
    ]
  }'
```

#### Widget Testing

1. **Visual Testing:** Verify widget appears and functions correctly
2. **Theme Testing:** Test light/dark mode switching
3. **Language Testing:** Verify language detection and switching
4. **Mobile Testing:** Test responsiveness on different screen sizes

#### Performance Testing

Monitor cache statistics:

```bash
curl http://127.0.0.1:8787/api/cache-stats
```

Check rate limiting status:

```bash
curl -I http://127.0.0.1:8787/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'
```

### Code Quality

#### Linting

Run linting checks:

```bash
# Check for syntax errors and style issues
npm run lint
```

#### Type Checking

The project uses JSDoc for type documentation. All functions include parameter and return type information.

### Building for Production

#### Production Deployment

```bash
# Deploy to Cloudflare Workers
npm run deploy

# Check deployment status
wrangler tail live-chat-widget
```

#### Environment Configuration

For production deployments, ensure:

1. **KV Namespaces:** Created and properly configured
2. **AI Binding:** Enabled in Cloudflare dashboard
3. **Custom Domain:** Optional, for branded URLs
4. **Rate Limits:** Configured according to usage requirements

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

## Frequently Asked Questions

### General Questions

**Q: What is the Live Chat Widget?**
A: The Live Chat Widget is an embeddable AI-powered chat interface that can be added to any website with a single script tag. It uses Cloudflare Workers and Llama 3.1 to provide intelligent responses.

**Q: How much does it cost to use?**
A: The widget uses Cloudflare's free tier for Workers and KV storage. AI usage may incur costs based on Cloudflare's AI pricing. The widget itself is free to deploy and use.

**Q: Can I customize the AI's personality?**
A: Yes, you can modify the `src/systemInstruction.txt` file to customize the AI's personality, knowledge, and response style.

### Technical Questions

**Q: What browsers are supported?**
A: The widget supports all modern browsers including Chrome, Firefox, Safari, and Edge. It requires JavaScript to be enabled.

**Q: Can I use this on a static website?**
A: Yes, the widget works on any website that can load external JavaScript, including static sites hosted on Netlify, Vercel, GitHub Pages, etc.

**Q: How does the widget handle user data?**
A: The widget does not store chat history or personal data. All conversations are processed in real-time and not retained after the session ends.

**Q: Can I integrate this with my existing chat system?**
A: The widget can be extended via the API to integrate with existing systems. See the API documentation for details.

### Customization Questions

**Q: How do I change the widget's appearance?**
A: Use CSS variables in your website's stylesheet or the `data-color` attribute on the script tag. See the Theming section for detailed instructions.

**Q: Can I change the widget's position on the page?**
A: Currently, the widget appears in the bottom-right corner. Custom positioning would require modifying the widget code.

**Q: How do I change the language?**
A: The widget automatically detects language from HTML attributes. You can also use the `data-azzar-lang` attribute or call `window.azzarChatSetLang()`.

### Troubleshooting

**Q: The widget doesn't appear on my website**
A: Check that the script URL is correct and accessible. Clear browser cache and verify there are no JavaScript errors in the console.

**Q: The AI responses are slow**
A: Response times depend on Cloudflare's AI service. Check your internet connection and ensure you're not hitting rate limits.

**Q: The theme doesn't match my website**
A: Verify your CSS variables are properly defined and the widget has access to them. Try using the `data-color` attribute for manual theme control.

## Contributing

We welcome contributions to improve the Live Chat Widget. Please follow these guidelines:

### Getting Started

1. **Fork the Repository**
   - Click the "Fork" button on GitHub
   - Clone your fork: `git clone https://github.com/your-username/live-chat-widget.git`

2. **Set Up Development Environment**
   ```bash
   cd live-chat-widget
   npm install
   npm run dev
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development Guidelines

#### Code Style
- Use consistent indentation (2 spaces)
- Add JSDoc comments for functions
- Follow existing naming conventions
- Keep functions focused and single-purpose

#### Testing
- Test your changes locally before submitting
- Verify widget functionality in different browsers
- Test with both light and dark themes
- Check mobile responsiveness

#### Commit Messages
- Use clear, descriptive commit messages
- Start with a verb (Add, Fix, Update, Remove)
- Keep first line under 50 characters
- Add detailed description if needed

### Submitting Changes

1. **Ensure Code Quality**
   ```bash
   # Run linting (if available)
   npm run lint

   # Test locally
   npm run dev
   ```

2. **Update Documentation**
   - Update README.md if adding new features
   - Update API.md for API changes
   - Add code comments for complex logic

3. **Create Pull Request**
   - Push your branch to GitHub
   - Create a pull request with a clear description
   - Reference any related issues

### Types of Contributions

**Bug Fixes:**
- Fix reported issues
- Improve error handling
- Enhance stability

**Features:**
- New functionality
- UI/UX improvements
- Performance enhancements

**Documentation:**
- Improve existing docs
- Add examples and tutorials
- Translate documentation

### Code Review Process

1. Automated checks will run on your PR
2. Maintainers will review your code
3. Address any feedback or requested changes
4. Once approved, your changes will be merged

### Reporting Issues

When reporting bugs or requesting features:

- Use the GitHub issue templates
- Provide clear steps to reproduce
- Include browser and OS information
- Attach screenshots if relevant

Thank you for contributing to the Live Chat Widget!

## License

This project is licensed under the MIT License. See the LICENSE file for full terms and conditions.

## Support

For support and questions:

- **Documentation:** Check this README and API.md
- **Issues:** Use GitHub Issues for bugs and feature requests
- **Discussions:** Use GitHub Discussions for questions and general discussion

---

*Built with Cloudflare Workers and Llama 3.1* 