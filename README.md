# Azzar AI Chat Widget (featuring FREA)

A modern, embeddable AI chat widget powered by Cloudflare Workers and Llama 3.1, featuring **FREA**, a highly personalized AI persona designed for easy integration and beautiful theming.

## Features

- **Specialized AI Persona (FREA):** An AI assistant specializing in web development, microcontrollers, and IoT, with knowledge about its creator.
- **Live Wikipedia Integration:** Automatically queries Wikipedia for factual questions (e.g., "what is React?", "who is Grace Hopper?") to provide accurate summaries.
- **AI-generated, language-aware welcome message** (adapts to your website's language)
- **Advanced Response Cleaning:** Intelligently deduplicates and formats AI responses for a clearer and more concise reading experience.
- **Automatic Dark/Light Theming:** Switches between a sleek dark and light theme based on your OS settings (`prefers-color-scheme`).
- **Modern Glassmorphic UI:** A beautiful, modern interface with blur effects inspired by Material You.
- Responsive, mobile-friendly design
- Conversation history is persisted in local storage
- Simple integration: just add one script tag
- API endpoint for custom integrations

## Installation

Add the following script to your website:

```html
<script src="https://<your-domain-or-worker>/widget.js"></script>
```

## Theming & Customization

The widget features two powerful theming modes that work together:

### 1. Automatic Color Theming (via CSS Variables)

The widget automatically adapts to your website's color scheme by reading your existing CSS variables. To enable this, define some or all of the following variables in your site's CSS (e.g., in a `:root` block):

| CSS Variable | Description | Default Value (Light) | Default Value (Dark) |
|---|---|---|---|
| `--primary-color` | Main accent color (buttons, user messages) | `#6200EE` | `#BB86FC` |
| `--primary-dark` | Darker shade for hover/focus states | `#3700b3` | `#D0BCFF` |
| `--on-primary` | Text color on primary backgrounds | `white` | `#381E72` |
| `--background` | Chat window background | `#f5f5f5` | `#121212` |
| `--nonary-color` | AI message background | `#e0e0e0` | `#333333` |
| `--octonary-color` | Chat container background (glassmorphic layer) | `rgba(255,255,255,0.8)` | `rgba(18,18,18,0.8)` |

**Example:**
```css
:root {
  --primary-color: #009688;
  --primary-dark: #00695c;
  --on-primary: #fff;
  --background: #fafafa;
  --nonary-color: #e3f2fd;
  --octonary-color: #ffffff;
}
```

The widget will automatically detect any variables you've set and apply them. Any variables you don't set will fall back to the defaults.

### 2. Automatic Dark/Light Mode

If no CSS variables are detected, the widget falls back to its built-in themes. It automatically adapts to the user's system-wide dark or light mode preference (`prefers-color-scheme`).

- **Automatic Mode Switching:** The theme changes instantly when the user switches their OS theme.
- **No Configuration Needed:** The light and dark themes are built-in and require no setup.
- **Customization via CSS:** You can always override the widget's styles using your own CSS by targeting its classes (e.g., `.azzar-chat-widget`, `.azzar-chat-window`).

## Language Detection & Welcome Message

- The widget detects the language in the following order:
  1. `window.AZZAR_CHAT_CONFIG.lang` (set before the widget loads)
  2. `<script src=".../widget.js" data-azzar-lang="...">`
  3. `<html lang="...">`
  4. `navigator.language`
- On load, it requests a welcome message from `/api/welcome-message?lang=...`.
- The backend uses FREA's AI persona (from `systemInstruction.txt`) to generate a short, friendly welcome message in the requested language.
- The welcome message will always match FREA's persona and the user's language.

**Ways to set the language:**

1. **Global JS config (highest priority):**
   ```html
   <script>
     window.AZZAR_CHAT_CONFIG = { lang: 'en' };
   </script>
   <script src="https://<your-domain-or-worker>/widget.js"></script>
   ```

2. **Script tag attribute:**
   ```html
   <script src="https://<your-domain-or-worker>/widget.js" data-azzar-lang="id"></script>
   ```

3. **HTML lang attribute:**
   ```html
   <html lang="en">
   ```

4. **Browser language (fallback):**
   If none of the above are set, the widget will use the browser's language.

**Dynamic language switching (for SPAs or language switchers):**

You can change the language at runtime using the global API:
```js
window.azzarChatSetLang('id'); // Switches to Bahasa Indonesia and resets the chat
window.azzarChatSetLang('en'); // Switches to English and resets the chat
```

The widget will fetch a new welcome message and reset the conversation history in the new language.

### 3. API Endpoints

For detailed information on all available API endpoints, request/response schemas, and parameters, please see the dedicated [API Reference (API.md)](./API.md).

Brief overview:
- **GET `/widget.js`**: Serves the widget's JavaScript.
- **GET `/widget-iframe`**: Serves the widget's iframe HTML.
- **POST `/api/chat`**: Send a message and conversation history, get an AI response.
- **GET `/api/welcome-message?lang=xx`**: Get a language-aware, AI-generated welcome message from FREA.
- **GET `/api/cache-stats`**: Get statistics about the in-memory cache (for debugging).

## Example: Full Integration

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>My Site with Azzar AI Chat</title>
  <style>
    /* Example: A custom green theme */
    :root {
      --primary-color: #4CAF50;
      --primary-dark: #388E3C;
      --on-primary: white;
      --background: #E8F5E9;
      --nonary-color: #C8E6C9;
      --octonary-color: rgba(232, 245, 233, 0.85);
    }
  </style>
</head>
<body>
  <!-- Your site content -->
  <script src="https://<your-domain-or-worker>/widget.js"></script>
</body>
</html>
```

- The widget will use Bahasa Indonesia for the welcome message.
- The theme will automatically match the custom green colors defined in the CSS.

## Updating the AI Persona

- Edit `src/systemInstruction.txt` to change FREA's persona, tone, or expertise.
- Deploy using `wrangler deploy` to sync the latest persona to your Worker.
- The welcome message and all AI responses from FREA will immediately reflect your changes.

## Advanced

- The widget supports dynamic theme changes (e.g., switching to dark mode at runtime).
- You can further customize the widget by overriding its CSS classes or using more advanced selectors.
- The welcome message is always generated by the AI, so you can localize or personalize it just by changing the persona or the page language.

## Troubleshooting

- If the welcome message or persona doesn't update, make sure you have deployed the latest `systemInstruction.txt` to your worker.
- Check your browser's console for errors if the widget doesn't appear or style correctly.

## License
MIT 

## Demo Page: Live Language Switching

The included demo page showcases robust, instant language switching for the chat widget:

- **Language switcher UI:** Buttons above the widget let you switch between English and Bahasa Indonesia instantly.
- **How it works:**
  - The demo page (parent) sends a `postMessage` to the widget iframe when you click a language button.
  - The widget iframe listens for this message and calls its internal `window.azzarChatSetLang` API.
  - FREA's welcome message is regenerated immediately in the selected language, and the chat resets.

**Parent page code (demo):**
```js
function postLangToIframe(lang) {
  var iframe = document.querySelector('.azzar-chat-iframe');
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage({ azzarSetLang: lang }, '*');
  }
}
document.getElementById('lang-en').addEventListener('click', function() {
  postLangToIframe('en');
});
document.getElementById('lang-id').addEventListener('click', function() {
  postLangToIframe('id');
});
```

**Widget iframe code:**
```js
window.addEventListener('message', function(event) {
  if (event.data && event.data.azzarSetLang) {
    if (typeof window.azzarChatSetLang === 'function') {
      window.azzarChatSetLang(event.data.azzarSetLang);
    }
  }
});
```

## Supported Languages

The widget backend can generate a welcome message in any language the AI model supports. The following languages are explicitly mapped to their full names for generating the welcome message prompt, but other language codes will also work:

- en: English
- id: Bahasa Indonesia
- ms: Bahasa Melayu
- jv: Javanese
- su: Sundanese
- fr: French
- de: German
- es: Spanish
- it: Italian
- pt: Portuguese
- ru: Russian
- zh: Chinese
- ja: Japanese
- ko: Korean
- ar: Arabic
- hi: Hindi
- th: Thai
- vi: Vietnamese

## Adding More Languages

To add more languages to the demo or improve welcome message generation:
- **Demo Page:** Add a new button to the demo page's language switcher UI and update the `postLangToIframe` handler.
- **Backend:** Add the language code and full name to the `langMap` in `src/index.js` for more precise welcome message prompts.
- The widget and backend will handle the rest automatically.

## Advanced Integration

- The widget supports dynamic language switching via API, UI, or even `<html lang>` changes (thanks to a MutationObserver).
- The demo page demonstrates best practices for cross-frame communication and robust multilingual support. 