# Azzar AI Chat Widget

A modern, embeddable AI chat widget powered by Cloudflare Workers and Llama 3.1. It's designed for easy integration, beautiful theming, and a smart, personalized AI experience.

## Features

- **Personalized AI:** Easily customize the AI's persona, knowledge, and tone by editing a single text file (`src/systemInstruction.txt`).
- **Intelligent Wikipedia Integration:** Provides accurate, summarized answers to factual questions by dynamically querying Wikipedia. The AI intelligently decides when to use Wikipedia and when to respond from its persona.
- **Smart Response Deduplication:** AI responses are processed to remove repetitive phrases and ensure concise, unique output.
- **Intelligent Theming:** Automatically adapts to your website's design, with multiple ways to control the look and feel, including automatic detection of dominant colors and CSS variables.
- **Modern UI:** A clean, responsive, and mobile-friendly glassmorphic interface.
- **Robust Rate Limiting:** Protects the API from abuse with intelligent rate limiting based on client IP.
- **Simple Integration:** Add the widget to your site with a single script tag.

## Installation

To use the widget, you first need to deploy the Cloudflare Worker. Make sure you have `wrangler` installed and configured.

1.  **Deploy the Worker:**
    ```bash
    wrangler deploy
    ```
    This will deploy your worker and provide you with a URL (e.g., `https://your-worker-name.your-account.workers.dev`).

2.  **Embed the Widget:**
    Add the following script tag to your website's HTML, replacing `<your-worker-url>` with the URL obtained from the deployment step. The widget will automatically appear and adapt to your site's theme.

    ```html
    <script src="https://<your-worker-url>/widget.js"></script>
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
    -   **Dominant Viewport Color:** Analyzes the main background color of your site to decide if it's light or dark.
    -   **CSS Variables:** Reads standard CSS variables like `--primary-color`, `--background`, `--text-color`, etc., to match your site's branding.
    -   **Inferred Styles:** If variables aren't present, it infers colors from prominent elements like buttons and links.

3.  **OS Preference (Fallback):**
    If no theme can be determined from the methods above, the widget will fall back to the user's operating system preference (`prefers-color-scheme`).

### Customizing with CSS Variables

For the most seamless integration, define any of the following CSS variables in your site's stylesheet (e.g., in a `:root` block). The widget will automatically adopt these styles.

| CSS Variable       | Description                                  |
| ------------------ | -------------------------------------------- |
| `--primary-color`  | Main accent color for buttons, user messages |
| `--on-primary`     | Text color for elements with a primary background |
| `--background`     | The main background of the chat window       |
| `--text-color`     | Primary text color                           |
| `--border-radius`  | Border radius for bubbles and inputs         |
| `--font-family`    | Font family for all widget text              |

**Example:**
```css
:root {
  --primary-color: #007bff;
  --on-primary: #ffffff;
  --background: #f8f9fa;
  --text-color: #212529;
  --border-radius: 12px;
}
```

## Language Detection

The widget automatically detects the language to use for its welcome message by checking in this order:

1.  **`window.AZZAR_CHAT_CONFIG.lang`**: A globally defined JavaScript variable.
2.  **`<script data-azzar-lang="...">`**: An attribute on the script tag.
3.  **`<html lang="...">`**: The `lang` attribute of your HTML tag.
4.  **`navigator.language`**: The browser's default language setting.

You can also change the language dynamically at any time by calling `window.azzarChatSetLang('your-lang-code')`.

## API

The widget exposes several endpoints for programmatic interaction. For detailed information, please see the [API Reference (API.md)](./API.md).

-   `GET /widget.js`: Serves the main widget script.
-   `GET /widget-iframe`: Serves the content for the widget's iframe.
-   `POST /api/chat`: The main chat endpoint.
-   `GET /api/welcome-message`: Retrieves the initial AI-generated greeting.
-   `GET /api/cache-stats`: Provides statistics about the in-memory (LRU) cache.

## Updating the AI Persona

To customize the AI's personality, knowledge, and tone:

1.  Edit the `src/systemInstruction.txt` file.
2.  Deploy your changes using `wrangler deploy`.

The AI will immediately adopt the new persona for all future conversations. 