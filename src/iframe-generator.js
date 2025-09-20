export function generateWidgetHTML(url) {
  // Get URL parameters
  const params = url.searchParams;
  const workerOrigin = url.origin; // The origin of the worker itself
  
  // Step 1: Determine the base theme (dark/light) as a fallback
  const baseTheme = params.get('theme') === 'dark' ? 'dark' : 'light';

  // Step 2: Define default color schemes for dark and light modes
  const colorDefaults = {
    light: {
      accentColor: '#6200EE',
      accentColorDark: '#3700b3',
      onAccentColor: 'white',
      chatContainerBg: 'rgba(255, 255, 255, 0.8)',
      chatWindowBg: '#f5f5f5',
      aiMessageBg: '#e0e0e0',
      aiMessageColor: '#333333',
      textColor: '#333333'
    },
    dark: {
      accentColor: '#BB86FC',
      accentColorDark: '#D0BCFF',
      onAccentColor: '#381E72',
      chatContainerBg: 'rgba(18, 18, 18, 0.8)',
      chatWindowBg: '#121212',
      aiMessageBg: '#333333',
      aiMessageColor: 'white',
      textColor: 'white'
    }
  };

  // Step 3: Get styling properties from URL params, using defaults as fallbacks
  const styles = {
    fontFamily: params.get('font-family') || "'Roboto', Arial, sans-serif",
    borderRadius: params.get('border-radius') || '18px',
    inputBorderRadius: params.get('border-radius') ? `calc(${params.get('border-radius')} + 6px)` : '24px'
  };
  
  // Get colors from URL params, or use the defaults for the base theme
  const colors = {
    accentColor: params.get('primary-color') || colorDefaults[baseTheme].accentColor,
    accentColorDark: params.get('primary-dark') || colorDefaults[baseTheme].accentColorDark,
    onAccentColor: params.get('on-primary') || colorDefaults[baseTheme].onAccentColor,
    chatWindowBg: params.get('background') || colorDefaults[baseTheme].chatWindowBg,
    aiMessageBg: params.get('nonary-color') || colorDefaults[baseTheme].aiMessageBg,
    chatContainerBg: params.get('octonary-color') || colorDefaults[baseTheme].chatContainerBg,
    aiMessageColor: colorDefaults[baseTheme].aiMessageColor,
    textColor: params.get('text-color') || colorDefaults[baseTheme].textColor
  };
  
  // Step 4: Derive final colors for the UI components
  const userMessageBg = colors.accentColor;
  const userMessageColor = colors.onAccentColor;
  const sendButtonHoverBg = colors.accentColorDark;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chat with FREA</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    :root { --footer-h: 64px; }
    body {
      margin: 0;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: transparent;
      backdrop-filter: blur(20px);
      font-family: ${styles.fontFamily};
    }
    .chat-container {
      width: 100%;
      height: 100%;
      border-radius: ${styles.borderRadius};
      background: ${colors.chatContainerBg};
      backdrop-filter: blur(20px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      color: ${colors.textColor};
      padding-bottom: env(safe-area-inset-bottom, 0);
    }
    .chat-header {
      background-color: ${colors.accentColor};
      color: ${colors.onAccentColor};
      padding: 10px;
      text-align: center;
      font-weight: bold;
    }
    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      padding-bottom: calc(16px + var(--footer-h));
      overscroll-behavior: contain;
    }
    
    .message {
      margin-bottom: 16px;
      max-width: 80%;
      padding: 12px 16px;
      border-radius: ${styles.borderRadius};
      line-height: 1.4;
      word-wrap: break-word;
    }
    
    .user-message {
      background-color: ${userMessageBg};
      color: ${userMessageColor};
      align-self: flex-end;
      margin-left: auto;
      border-bottom-right-radius: 4px;
    }
    
    .ai-message {
      background-color: ${colors.aiMessageBg};
      color: ${colors.aiMessageColor};
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    
    /* Add styles for ordered and unordered lists */
    .ai-message ol, .ai-message ul {
      padding-left: 20px;
      margin: 5px 0;
    }
    
    .ai-message li {
      margin-bottom: 5px;
    }
    
    /* Code style */
    .ai-message code {
      background-color: rgba(0,0,0,0.05);
      padding: 2px 4px;
      border-radius: 3px;
      font-family: monospace;
    }
    
    .input-container {
      display: grid;
      grid-template-columns: 1fr 36px 36px;
      column-gap: 8px;
      padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0)) 16px;
      border-top: 1px solid ${colors.aiMessageBg};
      background-color: ${colors.chatContainerBg};
      align-items: center;
      position: sticky;
      bottom: 0;
      min-height: var(--footer-h);
      width: 100%;
      box-sizing: border-box;
      z-index: 10;
    }
    
    .input-field {
      padding: 12px 16px;
      border: 1px solid ${colors.aiMessageBg};
      border-radius: ${styles.inputBorderRadius};
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
      background-color: ${colors.chatWindowBg};
      color: ${colors.textColor};
      min-height: 40px;
      min-width: 0; /* allow shrink in grid */
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .input-field:focus {
      border-color: ${colors.accentColor};
    }
    
    .send-button {
      background-color: ${colors.accentColor};
      color: ${userMessageColor};
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      justify-self: end;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
      overflow: visible;
    }
    
    .send-button:hover {
      background-color: ${sendButtonHoverBg};
    }
    
    .send-icon {
      width: 18px;
      height: 18px;
      pointer-events: none;
    }
    
    .clear-button {
      background-color: transparent;
      color: ${colors.accentColor};
      border: 1px solid ${colors.aiMessageBg};
      border-radius: 50%;
      width: 36px;
      height: 36px;
      justify-self: end;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      overflow: visible;
    }
    
    .clear-button:hover {
      background-color: ${colors.aiMessageBg};
    }
    
    .clear-icon {
      width: 18px;
      height: 18px;
      pointer-events: none;
    }
    
    .typing-indicator {
      display: none;
      padding: 12px 16px;
      background-color: ${colors.aiMessageBg};
      border-radius: ${styles.borderRadius};
      margin-bottom: 16px;
      margin-left: 16px;
      max-width: 80%;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    
    .typing-indicator.visible {
      display: block;
    }
    
    .dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: ${colors.accentColor};
      margin: 0 4px;
      animation: typing 1.4s infinite ease-in-out;
    }
    
    .dot:nth-child(1) {
      animation-delay: 0s;
    }
    
    .dot:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    .dot:nth-child(3) {
      animation-delay: 0.4s;
    }
    
    @keyframes typing {
      0%, 60%, 100% {
        transform: translateY(0);
      }
      30% {
        transform: translateY(-6px);
      }
    }
    
    .ai-message a {
      color: ${colors.accentColor};
      text-decoration: none;
      word-break: break-all;
      font-weight: 500;
      transition: color 0.2s ease-in-out;
      padding: 0 2px;
      border-radius: 2px;
      position: relative;
      display: inline-block;
    }
    
    .ai-message a:hover {
      text-decoration: none;
      background-color: #f0e6ff; /* Light purple background */
      color: ${colors.accentColor};
      box-shadow: 0 1px 0 ${colors.accentColor};
      transform: translateY(-1px);
    }
  </style>
</head>
<body>
  <div class="chat-container">
    <div class="chat-header">Support</div>
    <div class="messages" id="messages">
    </div>
    <div class="typing-indicator" id="typing-indicator">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
    <div class="input-container">
      <input type="text" class="input-field" id="input-field" placeholder="Type your message...">
      <button class="send-button" id="send-button">
        <svg class="send-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 0h24v24H0V0z" fill="none"/>
          <path d="M3.4 20.4l17.45-7.48c.81-.35.81-1.49 0-1.84L3.4 3.6c-.66-.29-1.39.2-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z"/>
        </svg>
      </button>
      <button class="clear-button" id="clear-button">
        <svg class="clear-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 0h24v24H0V0z" fill="none"/>
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z"/>
        </svg>
      </button>
    </div>
  </div>
  
  <script>
    // This is the origin of the worker, passed in from the server
    const workerOrigin = '${workerOrigin}';

    // Chat functionality
    const messagesContainer = document.getElementById('messages');
    const inputField = document.getElementById('input-field');
    const sendButton = document.getElementById('send-button');
    const clearButton = document.getElementById('clear-button');
    const typingIndicator = document.getElementById('typing-indicator');
    
    // Simple HTML sanitizer to prevent XSS attacks
    function sanitizeHtml(html) {
      // Create a temporary div to parse HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      // Allowed elements and attributes
      const allowedElements = ['STRONG', 'EM', 'CODE', 'BR', 'OL', 'UL', 'LI', 'A', 'P'];
      const allowedAttributes = {
        'A': ['href', 'target', 'rel']
      };

      // Function to sanitize a single element
      function sanitizeElement(element) {
        // Remove the element if it's not allowed
        if (!allowedElements.includes(element.tagName)) {
          // Replace with text content if available
          if (element.textContent) {
            element.parentNode.replaceChild(document.createTextNode(element.textContent), element);
          } else {
            element.parentNode.removeChild(element);
          }
          return;
        }

        // Sanitize attributes for allowed elements
        if (allowedAttributes[element.tagName]) {
          const allowedAttrs = allowedAttributes[element.tagName];
          const attrs = Array.from(element.attributes);

          attrs.forEach(attr => {
            if (!allowedAttrs.includes(attr.name)) {
              element.removeAttribute(attr.name);
            } else if (attr.name === 'href') {
              // Sanitize href attributes to prevent javascript: and data: URIs
              const href = attr.value.toLowerCase();
              if (href.startsWith('javascript:') || href.startsWith('data:') || href.startsWith('vbscript:')) {
                element.removeAttribute(attr.name);
              }
            }
          });
        } else {
          // Remove all attributes for elements without allowed attributes
          const attrs = Array.from(element.attributes);
          attrs.forEach(attr => element.removeAttribute(attr.name));
        }

        // Recursively sanitize child elements
        const children = Array.from(element.children);
        children.forEach(sanitizeElement);
      }

      // Sanitize all elements in the temporary div
      const elements = Array.from(tempDiv.children);
      elements.forEach(sanitizeElement);

      // Return the sanitized HTML
      return tempDiv.innerHTML;
    }

    // Simple function to convert markdown to HTML
    function markdownToHtml(text) {
      if (!text) return '';

      // First, escape HTML characters to prevent XSS before processing markdown
      text = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');

      // First, fix formatting issues - replace excessive blank lines
      text = text.replace(/\\n{3,}/g, '\\n\\n');

      // Handle cases where there might be multiple line breaks with spaces between them
      text = text.replace(/(\\s*\\n\\s*){3,}/g, '\\n\\n');
      
      // Special check for links before anything else
      // Links with markdown format [text](url)
      text = text.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, function(match, p1, p2) {
        // Remove any spaces that might be in the URL
        let url = p2.replace(/\\s+/g, '');
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          // If it's a Wikipedia link or other common domain, assume https
          if (url.includes('wikipedia.org') || url.includes('github.com')) {
            url = 'https://' + url;
          } else {
            url = 'https://' + url;
          }
        }
        return '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + p1 + '</a>';
      });
      
      // Plain URLs that are not part of markdown links - fix spaces within URLs
      text = text.replace(/(?:^|\\s)(https?:\\/\\/[^\\s<]+(?:\\.\\s*[^\\s<]+)*)/g, function(match, url) {
        // Remove any spaces from the URL
        const cleanUrl = url.replace(/\\s+/g, '');
        return ' <a href="' + cleanUrl + '" target="_blank" rel="noopener noreferrer">' + cleanUrl + '</a>';
      });
      
      // Replace numbered lists (e.g., 1. Item -> <ol><li>Item</li></ol>)
      let hasNumberedList = false;
      let listMatch = text.match(/^(\\d+)\\.(\\s.+)$/gm);
      
      if (listMatch) {
        hasNumberedList = true;
        
        // Create a temporary version without the list to process later
        let tempText = text;
        
        // Extract all list items
        let listItems = [];
        let listRegex = /^(\\d+)\\.(\\s.+)$/gm;
        let match;
        
        while ((match = listRegex.exec(text)) !== null) {
          listItems.push('<li>' + match[2].trim() + '</li>');
          // Remove this item from the temp text
          tempText = tempText.replace(match[0], '');
        }
        
        // Add the ordered list with items
        if (listItems.length > 0) {
          let listHtml = '<ol>' + listItems.join('') + '</ol>';
          // Find where to place the list in the original text
          let firstListItemIndex = text.indexOf(listMatch[0]);
          text = text.substring(0, firstListItemIndex) + listHtml + tempText;
        }
      }
      
      // Handle unordered lists (* or - items)
      let unorderedMatch = text.match(/^[*\\-](\\s.+)$/gm);
      if (unorderedMatch) {
        let tempText = text;
        let listItems = [];
        let listRegex = /^[*\\-](\\s.+)$/gm;
        let match;
        
        while ((match = listRegex.exec(text)) !== null) {
          listItems.push('<li>' + match[1].trim() + '</li>');
          tempText = tempText.replace(match[0], '');
        }
        
        if (listItems.length > 0) {
          let listHtml = '<ul>' + listItems.join('') + '</ul>';
          let firstListItemIndex = text.indexOf(unorderedMatch[0]);
          text = text.substring(0, firstListItemIndex) + listHtml + tempText;
        }
      }
      
      // Replace ** or __ for bold
      text = text.replace(/(\\*\\*|__)(.*?)\\1/g, '<strong>$2</strong>');
      
      // Replace * or _ for italics
      text = text.replace(/(\\*|_)(.*?)\\1/g, '<em>$2</em>');
      
      // Replace code blocks
      text = text.replace(/\`([^\`]+)\`/g, '<code>$1</code>');
      
      // Replace new lines with <br>
      text = text.replace(/\\n/g, '<br>');
      
      // Fix any excessive <br> tags
      text = text.replace(/(<br>\\s*){3,}/g, '<br><br>');

      // Apply HTML sanitization to prevent XSS attacks
      return sanitizeHtml(text);
    }
    
    // Keep track of conversation history
    let conversationHistory = [];
    const MAX_HISTORY = 10; // Keep last 5 exchanges (10 messages)
    
    // Load conversation history from localStorage if available
    const loadConversationHistory = async () => {
      const savedHistory = localStorage.getItem('azzarChatHistory');
      if (savedHistory) {
        try {
          conversationHistory = JSON.parse(savedHistory);
          messagesContainer.innerHTML = '';
          conversationHistory.forEach(msg => {
            addMessageToUI(msg.role === 'user' ? 'user' : 'ai', msg.content);
          });
        } catch (e) {
          console.error('Error loading chat history:', e);
          conversationHistory = [];
        }
      } else {
        conversationHistory = [];
      }
      saveConversationHistory();
    };
    
    // Save conversation history to localStorage
    const saveConversationHistory = () => {
      localStorage.setItem('azzarChatHistory', JSON.stringify(conversationHistory));
    };
    
    // Add a message to the UI
    const addMessageToUI = (sender, message) => {
      const messageElement = document.createElement('div');
      messageElement.className = 'message ' + sender + '-message';
      
      // Convert markdown to HTML for AI messages only
      if (sender === 'ai') {
        messageElement.innerHTML = markdownToHtml(message);
      } else {
        messageElement.textContent = message;
      }
      
      messagesContainer.appendChild(messageElement);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };
    
    // Add a message to the conversation history
    const addMessageToHistory = (role, content) => {
      conversationHistory.push({ role, content });
      // Keep only the last MAX_HISTORY messages
      if (conversationHistory.length > MAX_HISTORY) {
        conversationHistory = conversationHistory.slice(conversationHistory.length - MAX_HISTORY);
      }
      saveConversationHistory();
    };
    
    // Send a message to the AI
    const sendMessage = async () => {
      const message = inputField.value.trim();
      if (!message) return;
      
      // Add user message to UI and history
      addMessageToUI('user', message);
      addMessageToHistory('user', message);
      
      // Clear input field
      inputField.value = '';
      
      // Show typing indicator
      typingIndicator.classList.add('visible');
      
      try {
        // Send request to AI using an absolute URL
        const response = await fetch(workerOrigin + '/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            message,
            history: conversationHistory.slice(0, -1) // Send all except the last message (which is the user's message we just added)
          })
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        // Hide typing indicator
        typingIndicator.classList.remove('visible');
        
        // Add AI response to UI and history
        const aiResponse = data.response || "Sorry, I couldn't process that request.";
        addMessageToUI('ai', aiResponse);
        addMessageToHistory('assistant', aiResponse);
        
      } catch (error) {
        console.error('Error:', error);
        // Hide typing indicator
        typingIndicator.classList.remove('visible');
        // Show error message
        addMessageToUI('ai', "Sorry, there was an error processing your request. Please try again.");
      }
    };
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    
    inputField.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        sendMessage();
      }
    });
    
    clearButton.addEventListener('click', () => {
      // Clear UI
      messagesContainer.innerHTML = '';
      // Clear conversation history
      conversationHistory = [];
      // Save empty history to localStorage
      saveConversationHistory();
      // Optionally, add a welcome message back if desired, but not by reloading history
      // For now, just clear it.
    });
    
    // Load conversation history on page load
    loadConversationHistory();

    // Add cross-frame language switching support
    window.addEventListener('message', function(event) {
      if (event.data && event.data.azzarSetLang) {
        if (typeof window.azzarChatSetLang === 'function') {
          window.azzarChatSetLang(event.data.azzarSetLang);
        }
      }
    });
  </script>
</body>
</html>
  `;
}