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

The widget features a beautiful, modern **Glass-M3** design system that is applied out-of-the-box. It includes both a light and a dark theme, which can be controlled in two ways, in order of priority:

### 1. Manual Theme Selection (Highest Priority)

You can force a specific theme by adding the `data-color` attribute to the script tag. This is the most direct way to set a theme.

-   **Force Dark Mode:**
    ```html
    <script src=".../widget.js" data-color="dark"></script>
    ```
-   **Force Light Mode:**
    ```html
    <script src=".../widget.js" data-color="light"></script>
    ```

### 2. OS Preference (Automatic Fallback)

If `data-color` is not set, the widget will automatically match the user's operating system preference (`prefers-color-scheme`).

### Advanced Customization (Via CSS Variables)

While the widget is designed to look great without any changes, you can override the core Glass-M3 variables by defining them on your own site's `:root`. The widget will automatically detect and apply them.

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