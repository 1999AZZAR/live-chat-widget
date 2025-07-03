# Azzar AI Chat Widget

A modern, embeddable AI chat widget powered by Cloudflare Workers and Llama 3.1. It's designed for easy integration, beautiful theming, and a smart, personalized AI experience.

## Features

- **Personalized AI:** Easily customize the AI's persona and expertise by editing a single text file.
- **Live Wikipedia Integration:** Provides accurate, summarized answers to factual questions.
- **Intelligent Theming:** Automatically adapts to your website's design, with multiple ways to control the look and feel.
- **Language-Aware:** Detects your site's language and generates a welcome message to match.
- **Modern UI:** A clean, responsive, and mobile-friendly glassmorphic interface.
- **Simple Integration:** Add the widget to your site with a single script tag.

## Installation

Add the following script tag to your website's HTML. The widget will automatically appear and adapt to your site's theme.

```html
<script src="https://<your-worker-url>/widget.js"></script>
```

## Theming & Customization

The widget intelligently determines its theme by checking sources in a specific order of priority, ensuring it always looks great and integrates seamlessly with your site's design while maintaining a modern Glass-M3 aesthetic.

### Theme Priority

1.  **Host Page Theme Detection (Highest Priority):**
    The widget automatically attempts to detect the theme from your website's existing styles. It looks for:
    -   **CSS Variables:** Reads Glass-M3 variables like `--primary-accent` and `--radius-interactive` if you've defined them.
    -   **Inferred Styles:** If variables aren't present, it infers colors from prominent elements like buttons and links, and border-radius from buttons.
    -   **Background Color:** Analyzes your site's main background color to decide if a light or dark theme should be applied.

2.  **`data-color` Attribute (Manual Override):**
    You can force a specific theme by adding the `data-color` attribute to the script tag. This will override the automatic detection.
    -   **Force Dark Mode:**
        ```html
        <script src=".../widget.js" data-color="dark"></script>
        ```
    -   **Force Light Mode:**
        ```html
        <script src=".../widget.js" data-color="light"></script>
        ```

3.  **OS Preference (Fallback):**
    If no theme can be determined from the methods above, the widget will fall back to the user's operating system preference (`prefers-color-scheme`).

### Customizing with CSS Variables

For the most seamless integration, define any of the following Glass-M3 CSS variables in your site's stylesheet (e.g., in a `:root` block). The widget will automatically adopt these styles.

| CSS Variable         | Description                                     |
| -------------------- | ----------------------------------------------- |
| `--primary-accent`   | The main brand color for gradients and highlights. |
| `--secondary-accent` | The secondary brand color for gradients.        |
| `--radius-interactive` | The border radius for buttons, inputs, etc.   |
| `--font-family`      | The font used throughout the widget.            |

**Example:**
```css
:root {
  --primary-accent: #007bff;
  --secondary-accent: #6f42c1;
  --radius-interactive: 8px;
  --font-family: 'Georgia', serif;
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

## Updating the AI Persona

To customize the AI's personality, knowledge, and tone:

1.  Edit the `src/systemInstruction.txt` file.
2.  Deploy your changes using `wrangler deploy`.

The AI will immediately adopt the new persona for all future conversations. 