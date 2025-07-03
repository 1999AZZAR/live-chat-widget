export function generateWidgetJS(origin) {
    return `
  // Azzar AI Chat Widget
  (function() {
    // This is the origin of the worker, passed in when the script is generated.
    const workerOrigin = '${origin}';
  
    // Helper to get explicit language setting (robust, always up-to-date)
    function detectAzzarLang() {
      // 1. window.AZZAR_CHAT_CONFIG.lang
      if (window.AZZAR_CHAT_CONFIG && window.AZZAR_CHAT_CONFIG.lang) {
        return window.AZZAR_CHAT_CONFIG.lang;
      }
      // 2. <script data-azzar-lang="...">
      var scripts = document.querySelectorAll('script[data-azzar-lang]');
      if (scripts.length > 0) {
        return scripts[0].getAttribute('data-azzar-lang');
      }
      // 3. <html lang>
      if (document.documentElement.lang) {
        return document.documentElement.lang;
      }
      // 4. navigator.language
      if (navigator.language) {
        return navigator.language.split('-')[0];
      }
      return 'en';
    }
  
    // Robustly update language and regenerate welcome message
    function setAzzarLang(newLang, force) {
      if (typeof newLang === 'string' && newLang.length > 0) {
        window.azzarChatCurrentLang = newLang;
        // Always reset chat with new language
        if (typeof loadConversationHistory === 'function') {
          loadConversationHistory(true); // force reload welcome message
        }
      } else if (force) {
        // If no lang provided but force is true, re-detect and reload
        window.azzarChatCurrentLang = detectAzzarLang();
        if (typeof loadConversationHistory === 'function') {
          loadConversationHistory(true);
        }
      }
    }
  
    // Expose robust API
    window.azzarChatSetLang = function(newLang) {
      setAzzarLang(newLang, true);
    };
  
    // Observe <html lang> changes for dynamic language switching
    if (window.MutationObserver) {
      const htmlObserver = new MutationObserver(function(mutations) {
        for (const mutation of mutations) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
            setAzzarLang(document.documentElement.lang, true);
          }
        }
      });
      htmlObserver.observe(document.documentElement, { attributes: true });
    }
  
    // On widget load, always use robust detection
    window.azzarChatCurrentLang = detectAzzarLang();
  
    // Simplified dark/light theme detection and modern Material You glassmorphic UI
    const createWidget = () => {
      // Get theme from script tag data-color attribute, fallback to OS theme
      let scriptTheme = null;
      const currentScript = document.querySelector('script[src*="widget.js"]');
      if (currentScript) {
        const dataColor = currentScript.getAttribute('data-color');
        if (dataColor && (dataColor === 'dark' || dataColor === 'light')) {
          scriptTheme = dataColor;
        }
      }
      const osTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const initialTheme = scriptTheme || osTheme;
      
      const themeParams = new URLSearchParams({
        theme: initialTheme,
        // We can add more detected properties here in the future
      }).toString();

      // Inject the CSS for the widget launcher and container
      const style = document.createElement('style');
      style.textContent = `
        :root {
          --widget-primary-accent: ${initialTheme === 'dark' ? '#8b9ff9' : '#667eea'};
          --widget-text-on-accent: ${initialTheme === 'dark' ? '#1a202c' : '#ffffff'};
          --widget-radius-full: 9999px;
          --widget-radius-container: 24px;
        }

        #azzar-ai-widget-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
        }

        #azzar-ai-widget-button {
          background: var(--widget-primary-accent);
          color: var(--widget-text-on-accent);
          border: none;
          border-radius: var(--widget-radius-full);
          width: 60px;
          height: 60px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: transform 0.2s ease;
        }

        #azzar-ai-widget-button:hover {
          transform: scale(1.1);
        }

        #azzar-ai-widget-button svg {
          width: 32px;
          height: 32px;
        }

        #azzar-ai-widget-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 380px;
          height: 600px;
          border-radius: var(--widget-radius-container);
          overflow: hidden;
          display: none;
          opacity: 0;
          transform-origin: bottom right;
          transform: translateY(10px) scale(0.95);
          transition: opacity 0.3s ease, transform 0.3s ease;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          /* The iframe will have the glass background, so this can be solid */
          background-color: ${initialTheme === 'dark' ? 'rgba(26, 32, 44, 0.5)' : 'rgba(255, 255, 255, 0.5)'};
        }

        #azzar-ai-widget-window.open {
          display: block;
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      `;
      document.head.appendChild(style);

      // Create a container for the widget
      const widgetContainer = document.createElement('div');
      widgetContainer.id = 'azzar-ai-widget-container';
      document.body.appendChild(widgetContainer);

      const button = document.createElement('button');
      button.id = 'azzar-ai-widget-button';
      button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>';

      const chatWindow = document.createElement('div');
      chatWindow.id = 'azzar-ai-widget-window';
      
      const iframe = document.createElement('iframe');
      iframe.id = 'azzar-ai-widget';
      iframe.src = \`\${workerOrigin}/widget-iframe?\${themeParams}\`;
      iframe.style.border = 'none';
      iframe.style.width = '100%';
      iframe.title = 'Chat with FREA';
      
      chatWindow.appendChild(iframe);
      widgetContainer.appendChild(chatWindow);
      widgetContainer.appendChild(button);

      button.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
      });
    };
    
    // Initialize the widget
    if (document.readyState !== 'loading') {
      createWidget();
    } else {
      document.addEventListener('DOMContentLoaded', createWidget);
    }
  })();
    `;
  }
