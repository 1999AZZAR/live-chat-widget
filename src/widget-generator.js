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

        // Final approach: Determine theme based on the dominant background color of the visible viewport.
        // This is the most robust method as it reflects what the user actually sees.
        function getDominantViewportColor() {
          try {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d', { willReadFrequently: true });
            const { innerWidth: width, innerHeight: height } = window;
            canvas.width = width;
            canvas.height = height;

            // Draw the visible part of the page onto the canvas
            context.drawWindow(window, 0, 0, width, height, 'rgb(255,255,255)');
            
            // Sample a few key points to determine dominant color
            // (top-left, top-right, center, bottom-left, bottom-right)
            const points = [
              { x: 50, y: 50 },
              { x: width - 50, y: 50 },
              { x: width / 2, y: height / 2 },
              { x: 50, y: height - 50 },
              { x: width - 50, y: height - 50 }
            ];

            const colorCounts = {};
            let maxCount = 0;
            let dominantColor = 'rgb(255, 255, 255)'; // Default to white

            points.forEach(p => {
              const [r, g, b] = context.getImageData(p.x, p.y, 1, 1).data;
              const color = 'rgb(' + r + ', ' + g + ', ' + b + ')';
              colorCounts[color] = (colorCounts[color] || 0) + 1;
              if (colorCounts[color] > maxCount) {
                maxCount = colorCounts[color];
                dominantColor = color;
              }
            });
            
            return dominantColor;

          } catch (e) {
            console.error("Could not determine viewport color, falling back to body.", e);
            // Fallback if drawWindow is not available or fails (e.g., security restrictions)
            return bodyStyle.backgroundColor || rootStyle.backgroundColor;
          }
        }
        
        const mainBgColor = getDominantViewportColor();
        if (mainBgColor) {
            if (!detectedTheme['background']) detectedTheme['background'] = mainBgColor;
            const luminance = getLuminance(mainBgColor);
            detectedTheme['detected-theme-mode'] = luminance > 0.5 ? 'light' : 'dark';
        }

        // Priority 2: Infer other styles if variables are missing
        if (!detectedTheme['text-color']) {
            const mainContentElem = document.querySelector('main, article') || document.body;
            detectedTheme['text-color'] = getComputedStyle(mainContentElem).color;
        }

        // Infer accent colors from a prominent button or link, with Tailwind CSS support
        if (!detectedTheme['primary-color']) {
          let primaryButton = null;
          const allButtons = Array.from(document.querySelectorAll('button'));

          // Tailwind-specific detection: find a button with a non-neutral 'bg-' class
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

        // Sanity check for border-radius to keep it within reasonable bounds
        if (detectedTheme['border-radius']) {
            const radius = parseFloat(detectedTheme['border-radius']);
            if (radius < 4 || radius > 30) {
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
      
      // Step 3: Build the iframe URL with theme and color parameters
      const queryParams = new URLSearchParams({ theme: finalTheme });
      for (const [key, value] of Object.entries(hostTheme)) {
        queryParams.set(key, value);
      }
      const iframeSrc = \`\${workerOrigin}/widget-iframe?\${queryParams.toString()}\`;
      
      const accentColor = hostTheme['primary-color'] || (finalTheme === 'dark' ? '#BB86FC' : '#6200EE');
      const buttonBg = finalTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.7)';
      const windowBg = hostTheme['octonary-color'] || (finalTheme === 'dark' ? 'rgba(28, 28, 28, 0.75)' : 'rgba(255, 255, 255, 0.75)');
      
      // Inject enhanced Material You button and window styles
      const style = document.createElement('style');
      style.textContent = \`
        @keyframes wave {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .azzar-chat-widget {
          position: fixed;
          bottom: 20px;
          right: 20px;
          font-family: 'Roboto', sans-serif;
          z-index: 10000;
          animation: fadeIn 0.5s ease-in-out;
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
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .azzar-chat-button::before, .azzar-chat-button::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: \${accentColor};
          animation: wave 2.5s infinite ease-out;
          z-index: -1;
        }
        .azzar-chat-button::after {
            animation-delay: -1.25s; /* Start the second wave halfway through */
        }
        .azzar-chat-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2), 0 12px 32px \${accentColor}60;
        }
        .azzar-chat-icon {
          width: 32px;
          height: 32px;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          color: \${hostTheme['on-primary'] || (finalTheme === 'dark' ? '#000' : '#fff')};
        }
        .azzar-chat-button:hover .azzar-chat-icon {
          transform: rotate(20deg) scale(1.15);
        }
        .azzar-chat-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 360px;
          height: 500px;
          border-radius: 18px;
          background: \${windowBg};
          backdrop-filter: saturate(180%) blur(20px);
          -webkit-backdrop-filter: saturate(180%) blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 12px 32px rgba(0,0,0,0.25);
          overflow: hidden;
          display: none;
          opacity: 0;
          transform-origin: bottom right;
          transform: translateY(10px) scale(0.95);
          transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .azzar-chat-window.open {
          display: block;
          opacity: 1;
          transform: translateY(0) scale(1);
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
