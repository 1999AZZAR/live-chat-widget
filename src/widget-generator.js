export function generateWidgetJS(origin) {
    return `
  // Azzar AI Chat Widget
  (function() {
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
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = isDarkMode ? 'dark' : 'light';
      const accentColor = theme === 'dark' ? '#BB86FC' : '#6200EE';
      const buttonBg = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.7)';
      const windowBg = theme === 'dark' ? 'rgba(18,18,18,0.8)' : 'rgba(255,255,255,0.8)';
      
      // Inject enhanced Material You button and window styles
      const style = document.createElement('style');
      style.textContent = \`
        .azzar-chat-widget {
          position: fixed;
          bottom: 20px;
          right: 20px;
          font-family: 'Roboto', sans-serif;
          z-index: 10000;
        }
        .azzar-chat-button {
          position: relative;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: \${buttonBg};
          border: 2px solid \${accentColor};
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .azzar-chat-button:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 48px rgba(0,0,0,0.3);
        }
        .azzar-chat-button::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 100%;
          background: \${accentColor}33;
          border-radius: 50%;
          transform: scale(0);
          opacity: 0;
          transition: transform 0.5s, opacity 0.5s;
        }
        .azzar-chat-button:active::after {
          transform: scale(1.5);
          opacity: 0.5;
          transition: transform 0s, opacity 0s;
        }
        .azzar-chat-icon {
          width: 32px;
          height: 32px;
          fill: \${accentColor};
          transition: transform 0.2s ease;
        }
        .azzar-chat-button:hover .azzar-chat-icon {
          transform: scale(1.2);
        }
        .azzar-chat-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 360px;
          height: 500px;
          border-radius: 16px;
          background: \${windowBg};
          backdrop-filter: blur(20px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          overflow: hidden;
          display: none;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .azzar-chat-window.open {
          display: block;
          opacity: 1;
          transform: translateY(0);
        }
        .azzar-chat-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
      \`;
      document.head.appendChild(style);
      
      // Create widget structure
      const widget = document.createElement('div');
      widget.className = 'azzar-chat-widget';
      
      const button = document.createElement('div');
      button.className = 'azzar-chat-button';
      button.innerHTML = '<svg class="azzar-chat-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/><path d="M7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z"/></svg>';
      
      const chatWindow = document.createElement('div');
      chatWindow.className = 'azzar-chat-window';
      
      const iframe = document.createElement('iframe');
      iframe.className = 'azzar-chat-iframe';
      iframe.src = '${origin}/widget-iframe?theme=' + theme;
      iframe.title = 'Chat with Azzar';
      
      chatWindow.appendChild(iframe);
      widget.appendChild(chatWindow);
      widget.appendChild(button);
      document.body.appendChild(widget);
      
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
