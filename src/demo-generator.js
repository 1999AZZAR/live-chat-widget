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

      @media (prefers-color-scheme: dark) {
        :root {
          --bg-color: #121212;
          --text-color: #e0e0e0;
          --primary-color: #D0BCFF; /* Material You Purple (Dark) */
          --on-primary-color: #381E72;
          --surface-color: rgba(30, 30, 30, 0.7);
          --surface-border-color: rgba(255, 255, 255, 0.1);
          --code-bg-color: rgba(255, 255, 255, 0.1);
          --shadow-color: rgba(0, 0, 0, 0.3);
        }
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

      .lang-switcher {
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

      .lang-btn {
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

      .lang-btn.active, .lang-btn:hover {
        background: var(--primary-color);
        color: var(--on-primary-color);
      }
      
      .lang-switcher span {
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
      
    <div class="lang-switcher">
        <span>Language:</span>
      <button class="lang-btn" id="lang-en">English</button>
      <button class="lang-btn" id="lang-id">Bahasa Indonesia</button>
    </div>
      
    <div class="container">
      <h2>How to Install</h2>
      <p>Add the following script to your website:</p>
      <pre><code>&lt;script src="${baseUrl}/widget.js"&gt;&lt;/script&gt;</code></pre>
    </div>
      
    <div class="container">
      <h2>Features</h2>
      <ul>
        <li>Automatically adapts to your website's color scheme</li>
        <li>Responsive design that works on all devices</li>
        <li>Persists conversation history in local storage</li>
        <li>Simple integration with just one line of code</li>
          <li>Welcome message is generated by FREA (the AI) and adapts to your website's language</li>
          <li><b>Live Wikipedia Search:</b> Ask about topics like 'what is javascript' or 'who is Grace Hopper' to get summaries from Wikipedia.</li>
          <li><b>Specialized Persona:</b> FREA is an expert in web development, IoT, and microcontrollers.</li>
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
    
    <script src="${baseUrl}/widget.js"></script>
    <script>
      // Language switcher logic with postMessage to iframe
      function setActiveLangBtn(lang) {
        document.getElementById('lang-en').classList.toggle('active', lang === 'en');
        document.getElementById('lang-id').classList.toggle('active', lang === 'id');
      }
      function postLangToIframe(lang) {
        var iframe = document.querySelector('.azzar-chat-iframe');
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({ azzarSetLang: lang }, '*');
        }
      }
      document.getElementById('lang-en').addEventListener('click', function() {
        postLangToIframe('en');
        setActiveLangBtn('en');
      });
      document.getElementById('lang-id').addEventListener('click', function() {
        postLangToIframe('id');
        setActiveLangBtn('id');
      });
      // Set initial active button
      setActiveLangBtn('en');
    </script>
  </body>
  </html>`;
  }