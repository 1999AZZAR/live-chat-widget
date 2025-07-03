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
      
      // Step 2: Advanced theme detection
      function detectHostTheme() {
        const rootStyle = getComputedStyle(document.documentElement);
        const bodyStyle = getComputedStyle(document.body);

        // Helper to convert any CSS color string to a reliable RGB format
        function getRgb(colorStr) {
          if (!colorStr) return null;
          let div = document.createElement('div');
          div.style.color = colorStr;
          // The browser will compute the color into a standardized RGB format.
          document.body.appendChild(div);
          let rgbStr = getComputedStyle(div).color;
          document.body.removeChild(div);
          return rgbStr;
        }
        
        // Helper to calculate the luminance of a color to determine if it's light or dark
        function getLuminance(color) {
          const rgbStr = getRgb(color);
          if (!rgbStr) return 0.5; // Default to neutral if color can't be parsed

          const rgb = rgbStr.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)/);
          if (!rgb) return 0.5; // Can't parse, assume neutral
          const r = parseInt(rgb[1]) / 255;
          const g = parseInt(rgb[2]) / 255;
          const b = parseInt(rgb[3]) / 255;
          // Formula for perceived luminance
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        }

        let detectedTheme = {
          // Priority 1: Explicit CSS variables that match Glass-M3 overrides
          'primary-color': rootStyle.getPropertyValue('--primary-accent').trim(),
          'secondary-color': rootStyle.getPropertyValue('--secondary-accent').trim(),
          'border-radius': rootStyle.getPropertyValue('--radius-interactive').trim(),
          'font-family': bodyStyle.fontFamily || rootStyle.getPropertyValue('--font-family').trim(),
        };

        // This is a simplified check for background color to determine light/dark mode
        const mainBgColor = bodyStyle.backgroundColor || rootStyle.backgroundColor;
        if (mainBgColor) {
            const luminance = getLuminance(mainBgColor);
            detectedTheme['detected-theme-mode'] = luminance > 0.5 ? 'light' : 'dark';
        }

        // Priority 2: Infer other styles if variables are missing
        // Infer accent colors from a prominent button or link
        if (!detectedTheme['primary-color']) {
            let primaryButton = document.querySelector('button[class*="primary"], button[class*="btn-primary"], button:not([style*="background: transparent"])');
            if (primaryButton) {
                const btnStyle = getComputedStyle(primaryButton);
                detectedTheme['primary-color'] = btnStyle.backgroundColor;
            } else {
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

        // Sanity check for border-radius to keep it within reasonable bounds for the design system
        if (detectedTheme['border-radius']) {
            const radius = parseFloat(detectedTheme['border-radius']);
            if (radius > 30) {
                delete detectedTheme['border-radius']; // Reset to default if value is extreme
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
      
      // The final theme prioritizes the script tag, then the page's detected mode, then the OS mode.
      const finalTheme = scriptTheme || hostTheme['detected-theme-mode'] || osTheme;
      
      // Step 3: Build the iframe URL with theme and Glass-M3 override parameters
      const queryParams = new URLSearchParams({ theme: finalTheme });
      for (const [key, value] of Object.entries(hostTheme)) {
        queryParams.set(key, value);
      }
      const iframeSrc = \`${workerOrigin}/widget-iframe?\${queryParams.toString()}\`;
      
      const accentColor = hostTheme['primary-color'] || (finalTheme === 'dark' ? '#8b9ff9' : '#667eea');
      const onAccentColor = hostTheme['on-primary'] || (finalTheme === 'dark' ? '#1a202c' : '#ffffff');
      const windowBgColor = finalTheme === 'dark' ? 'rgba(26, 32, 44, 0.5)' : 'rgba(255, 255, 255, 0.5)';

      // Inject the CSS for the widget launcher and container
      const style = document.createElement('style');
      style.textContent = \`
        #azzar-ai-widget-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
        }

        #azzar-ai-widget-button {
          background: \${accentColor};
          color: \${onAccentColor};
          border: none;
          border-radius: 9999px;
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
          border-radius: 24px;
          overflow: hidden;
          display: none;
          opacity: 0;
          transform-origin: bottom right;
          transform: translateY(10px) scale(0.95);
          transition: opacity 0.3s ease, transform 0.3s ease;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          background-color: \${windowBgColor};
        }

        #azzar-ai-widget-window.open {
          display: block;
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      \`;
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
      iframe.src = iframeSrc;
      iframe.style.border = 'none';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.title = 'Chat Widget';
      
      chatWindow.appendChild(iframe);
      widgetContainer.appendChild(chatWindow);
      widgetContainer.appendChild(button);

      button.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
      });
    };
    createWidget();
  })();
  `;
}
