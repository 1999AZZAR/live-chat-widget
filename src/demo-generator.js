export function generateInstructionsHTML(baseUrl) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Azzar AI Chat Widget - Demo</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
      
      :root {
        --bg-color: #f8f9fa;
        --text-color: #212529;
        --primary-color: #6750A4; /* Material You Purple */
        --on-primary-color: #ffffff;
        --surface-color: rgba(255, 255, 255, 0.7);
        --surface-border-color: rgba(0, 0, 0, 0.1);
        --code-bg-color: rgba(0, 0, 0, 0.05);
        --shadow-color: rgba(0, 0, 0, 0.1);
      }

      body.dark-mode {
        --bg-color: #121212;
        --text-color: #e0e0e0;
        --primary-color: #D0BCFF; /* Material You Purple (Dark) */
        --on-primary-color: #381E72;
        --surface-color: rgba(30, 30, 30, 0.7);
        --surface-border-color: rgba(255, 255, 255, 0.1);
        --code-bg-color: rgba(255, 255, 255, 0.1);
        --shadow-color: rgba(0, 0, 0, 0.3);
      }

      body {
        font-family: 'Roboto', Arial, sans-serif;
        line-height: 1.7;
        margin: 0;
        padding: 40px 20px;
        background-color: var(--bg-color);
        color: var(--text-color);
        transition: background-color 0.3s, color 0.3s;
      }

      .page-container {
        max-width: 800px;
        margin: 0 auto;
      }

      h1, h2 {
        font-weight: 700;
        color: var(--primary-color);
        text-align: center;
      }
      
      h1 {
        font-size: 2.5rem;
        margin-bottom: 40px;
      }

      h2 {
        font-size: 1.8rem;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--surface-border-color);
      }

      .container {
        margin: 40px 0;
        padding: 25px;
        background: var(--surface-color);
        border-radius: 16px;
        border: 1px solid var(--surface-border-color);
        backdrop-filter: blur(15px);
        -webkit-backdrop-filter: blur(15px);
        box-shadow: 0 8px 24px var(--shadow-color);
        transition: background-color 0.3s, border-color 0.3s;
      }

      code {
        background: var(--code-bg-color);
        padding: 3px 6px;
        border-radius: 6px;
        font-family: 'SF Mono', 'Fira Code', monospace;
        font-size: 0.9em;
      }

      pre {
        background: var(--code-bg-color);
        padding: 20px;
        border-radius: 12px;
        overflow-x: auto;
        border: 1px solid var(--surface-border-color);
        line-height: 1.5;
      }

      pre code {
        padding: 0;
        background: none;
        border: none;
      }

      .lang-switcher, .theme-switcher {
        margin: 30px 0;
        display: flex;
        gap: 12px;
        align-items: center;
        justify-content: center;
        padding: 10px;
        background: var(--surface-color);
        border-radius: 50px; /* Pill shape */
        backdrop-filter: blur(15px);
        width: fit-content;
        margin: 40px auto;
        border: 1px solid var(--surface-border-color);
        box-shadow: 0 4px 12px var(--shadow-color);
      }

      .lang-btn, .theme-btn {
        background: transparent;
        color: var(--text-color);
        border: none;
        border-radius: 50px;
        padding: 10px 20px;
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.3s, color 0.3s;
      }

      .lang-btn.active, .lang-btn:hover,
      .theme-btn.active, .theme-btn:hover {
        background: var(--primary-color);
        color: var(--on-primary-color);
      }
      
      .lang-switcher span, .theme-switcher span {
        padding: 0 10px;
        font-weight: 500;
      }
      
      footer {
        text-align: center;
        margin-top: 50px;
        opacity: 0.7;
      }

      a {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: 500;
      }

      a:hover {
        text-decoration: underline;
      }
      
      ul {
        list-style-type: none;
        padding: 0;
      }
      
      li {
        padding: 10px 0 10px 25px;
        position: relative;
      }

      li::before {
        content: '✨';
        position: absolute;
        left: 0;
        top: 10px;
      }
    </style>
  </head>
  <body>
    <div class="page-container">
      <h1>Azzar AI Chat Widget (FREA)</h1>
      
      <div class="container">
        <h2>Installation</h2>
        <p>Just add one of the following script tags to your website. The widget will automatically appear.</p>
        <pre><code id="install-code-auto">&lt;!-- For automatic theme detection --&gt;
&lt;script src="${baseUrl}/widget.js"&gt;&lt;/script&gt;

&lt;!-- To force a specific theme --&gt;
&lt;script src="${baseUrl}/widget.js" data-color="light"&gt;&lt;/script&gt;
&lt;script src="${baseUrl}/widget.js" data-color="dark"&gt;&lt;/script&gt;</code></pre>
      </div>

      <div class="theme-switcher">
        <span>Theme:</span>
        <button class="theme-btn active" id="theme-auto">Auto</button>
        <button class="theme-btn" id="theme-light">Light</button>
        <button class="theme-btn" id="theme-dark">Dark</button>
      </div>

    <div class="lang-switcher">
        <span>Language:</span>
      <button class="lang-btn active" id="lang-en">English</button>
      <button class="lang-btn" id="lang-id">Bahasa Indonesia</button>
    </div>
      
    <div class="container">
      <h2>Features</h2>
      <ul>
        <li><b>Intelligent Theming:</b> Automatically adapts to your website's design.</li>
        <li><b>Personalized AI:</b> Easily customize the AI's persona and expertise.</li>
        <li><b>Live Wikipedia Integration:</b> Provides accurate, summarized answers to factual questions.</li>
        <li><b>Language-Aware:</b> Detects your site's language for a localized welcome.</li>
        <li><b>Modern UI:</b> Clean, responsive, and mobile-friendly glassmorphic interface.</li>
        <li><b>Simple Integration:</b> Add to your site with a single script tag.</li>
      </ul>
    </div>
      
    <div class="container">
      <h2>API Endpoint</h2>
      <p>For custom integrations, you can use the API endpoint directly:</p>
      <code>POST ${baseUrl}/api/chat</code>
      <p>Request body:</p>
      <pre><code>{
    "message": "User message here",
    "history": [
      {"role": "user", "content": "Previous user message"},
      {"role": "assistant", "content": "Previous AI response"}
    ]
  }</code></pre>
    </div>
      
    <footer>
      <p>Created by <a href="https://azzar.netlify.app/porto" target="_blank">Azzar</a></p>
    </footer>
    </div>
    
    <div id="widget-container"></div>

    <script>
      function loadWidget(theme) {
        // Remove existing widget and script
        const oldWidget = document.querySelector('.azzar-chat-widget');
        if (oldWidget) {
          oldWidget.remove();
        }
        const oldScript = document.querySelector('script[src*="/widget.js"]');
        if (oldScript) {
          oldScript.remove();
        }

        // Create and add new script
        const newScript = document.createElement('script');
        newScript.src = '${baseUrl}/widget.js';
        if (theme && theme !== 'auto') {
          newScript.dataset.color = theme;
        }
        document.body.appendChild(newScript);
      }

      // --- Theme Switcher Logic ---
      let currentTheme = 'auto';
      const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

      function applyPageTheme() {
        if (currentTheme === 'auto') {
          document.body.classList.toggle('dark-mode', prefersDarkScheme.matches);
        } else {
          document.body.classList.toggle('dark-mode', currentTheme === 'dark');
        }
      }

      prefersDarkScheme.addEventListener("change", applyPageTheme);

      function setActiveThemeBtn(theme) {
        document.querySelectorAll('.theme-btn').forEach(btn => {
          btn.classList.toggle('active', btn.id === 'theme-' + theme);
        });
      }

      document.getElementById('theme-auto').addEventListener('click', function() {
        currentTheme = 'auto';
        loadWidget('auto');
        setActiveThemeBtn('auto');
        applyPageTheme();
      });
      document.getElementById('theme-light').addEventListener('click', function() {
        currentTheme = 'light';
        loadWidget('light');
        setActiveThemeBtn('light');
        applyPageTheme();
      });
      document.getElementById('theme-dark').addEventListener('click', function() {
        currentTheme = 'dark';
        loadWidget('dark');
        setActiveThemeBtn('dark');
        applyPageTheme();
      });

      // --- Language Switcher Logic ---
      function setActiveLangBtn(lang) {
        document.querySelectorAll('.lang-btn').forEach(btn => {
          btn.classList.toggle('active', btn.id === 'lang-' + lang);
        });
      }

      function postLangToIframe(lang) {
        // Wait for iframe to be ready
        const interval = setInterval(() => {
          const iframe = document.querySelector('.azzar-chat-iframe');
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({ azzarSetLang: lang }, '*');
            clearInterval(interval);
          }
        }, 100);
      }

      document.getElementById('lang-en').addEventListener('click', function() {
        postLangToIframe('en');
        setActiveLangBtn('en');
      });
      document.getElementById('lang-id').addEventListener('click', function() {
        postLangToIframe('id');
        setActiveLangBtn('id');
      });

      // --- Initial Load ---
      document.addEventListener('DOMContentLoaded', function() {
        loadWidget('auto'); // Load with auto theme initially
        setActiveThemeBtn('auto');
        applyPageTheme();
        setActiveLangBtn('en'); // Set default language button
      });
    </script>
  </body>
  </html>`;
  }