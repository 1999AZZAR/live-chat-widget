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
      // Step 1: Base theme detection
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = isDarkMode ? 'dark' : 'light';
      
      // Step 2: Advanced theme detection
      function detectHostTheme() {
        const rootStyle = getComputedStyle(document.documentElement);
        const bodyStyle = getComputedStyle(document.body);
        let detectedTheme = {
          // Priority 1: Explicit CSS variables
          'primary-color': rootStyle.getPropertyValue('--primary-color').trim(),
          'primary-dark': rootStyle.getPropertyValue('--primary-dark').trim(),
          'on-primary': rootStyle.getPropertyValue('--on-primary').trim(),
          'background': rootStyle.getPropertyValue('--background').trim(),
          'text-color': rootStyle.getPropertyValue('--text-color').trim(),
          'border-radius': rootStyle.getPropertyValue('--border-radius').trim(),
          'nonary-color': rootStyle.getPropertyValue('--nonary-color').trim(),
          'octonary-color': rootStyle.getPropertyValue('--octonary-color').trim(),
          // Always detect font-family
          'font-family': bodyStyle.fontFamily
        };

        // Priority 2: Infer from computed styles if variables are missing
        if (!detectedTheme['background']) detectedTheme['background'] = bodyStyle.backgroundColor;
        if (!detectedTheme['text-color']) detectedTheme['text-color'] = bodyStyle.color;

        // Infer accent colors from a prominent button or link, with Tailwind CSS support
        if (!detectedTheme['primary-color']) {
          let primaryButton = null;
          const allButtons = Array.from(document.querySelectorAll('button'));

          // Tailwind-specific detection: find a button with a non-neutral `bg-` class
          const tailwindButtons = allButtons.filter(btn => {
            const classList = Array.from(btn.classList);
            const hasBgClass = classList.some(c => c.startsWith('bg-') && !c.includes('transparent'));
            const isNeutral = classList.some(c => c.match(/bg-(gray|zinc|neutral|stone|slate|white|black)/));
            return hasBgClass && !isNeutral;
          });

          if (tailwindButtons.length > 0) {
            primaryButton = tailwindButtons[0]; // Use the first likely candidate
          }

          // Fallback to generic button detection if no Tailwind button is found
          if (!primaryButton) {
            primaryButton = document.querySelector('button[class*="primary"], button[class*="btn-primary"], button:not([style*="background: transparent"])');
          }

          if (primaryButton) {
            const btnStyle = getComputedStyle(primaryButton);
            detectedTheme['primary-color'] = btnStyle.backgroundColor;
            detectedTheme['on-primary'] = btnStyle.color;
          } else {
            // Last resort: check a link's color
            const link = document.querySelector('a');
            if (link) {
                detectedTheme['primary-color'] = getComputedStyle(link).color;
            }
          }
        }
        
        // Infer border-radius from a button
        if (!detectedTheme['border-radius']) {
            const sampleButton = document.querySelector('button, input[type="submit"]');
            if (sampleButton) {
                detectedTheme['border-radius'] = getComputedStyle(sampleButton).borderRadius;
            }
        }

        // Clean up theme object, removing empty or transparent values
        Object.keys(detectedTheme).forEach(key => {
          const value = detectedTheme[key];
          if (!value || value === 'rgba(0, 0, 0, 0)') {
            delete detectedTheme[key];
          }
        });

        return detectedTheme;
      }

      const hostTheme = detectHostTheme();
      
      // Step 3: Build the iframe URL with theme and color parameters
      const queryParams = new URLSearchParams({ theme });
      for (const [key, value] of Object.entries(hostTheme)) {
        queryParams.set(key, value);
      }
      const iframeSrc = \`\${workerOrigin}/widget-iframe?\${queryParams.toString()}\`;
      
      const accentColor = hostTheme['primary-color'] || (theme === 'dark' ? '#BB86FC' : '#6200EE');
      const buttonBg = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.7)';
      const windowBg = hostTheme['octonary-color'] || (theme === 'dark' ? 'rgba(18,18,18,0.8)' : 'rgba(255,255,255,0.8)');
      
      // Inject enhanced Material You button and window styles
      const style = document.createElement('style');
      style.textContent = \`
        @keyframes wave {
          from {
            transform: scale(1);
            opacity: 0.4;
          }
          to {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        .azzar-chat-widget {
          position: fixed;
          bottom: 20px;
          right: 20px;
          font-family: 'Roboto', sans-serif;
          z-index: 10000;
        }
        .azzar-chat-button {
          position: relative;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: \${accentColor};
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15), 0 8px 24px \${accentColor}40;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .azzar-chat-button::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: \${accentColor};
          animation: wave 2s infinite ease-out;
          z-index: -1;
        }
        .azzar-chat-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2), 0 12px 32px \${accentColor}60;
        }
        .azzar-chat-icon {
          width: 32px;
          height: 32px;
          transition: transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
          color: \${hostTheme['on-primary'] || (isDarkMode ? '#000' : '#fff')};
        }
        .azzar-chat-button:hover .azzar-chat-icon {
          transform: rotate(15deg) scale(1.1);
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
      button.innerHTML = '<svg class="azzar-chat-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>';
      
      const chatWindow = document.createElement('div');
      chatWindow.className = 'azzar-chat-window';
      
      const iframe = document.createElement('iframe');
      iframe.className = 'azzar-chat-iframe';
      iframe.src = iframeSrc;
      iframe.title = 'Chat with FREA';
      
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
