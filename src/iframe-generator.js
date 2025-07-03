export function generateWidgetHTML(url) {
  // Get URL parameters
  const params = url.searchParams;
  const workerOrigin = url.origin; // The origin of the worker itself
  
  // Step 1: Determine the base theme (dark/light)
  const theme = params.get('theme') === 'dark' ? 'dark' : 'light';

  // Step 2: Get dynamic styles from URL params to override Glass-M3 variables
  const overrides = {
    '--primary-accent': params.get('primary-color'),
    '--secondary-accent': params.get('secondary-color'),
    '--radius-interactive': params.get('border-radius'),
    '--font-family': params.get('font-family'),
  };

  // Filter out any null or undefined overrides
  const cssOverrides = Object.entries(overrides)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chat with FREA</title>
  <style>
    /* 1. Glass-M3 Design System: Base Variables */
    :root {
      /* Base Font */
      --font-family: "'Roboto', Arial, sans-serif";

      /* Radii Hierarchy */
      --radius-container: 24px;
      --radius-nested: 16px;
      --radius-interactive: 12px;
      --radius-small: 6px;
      --radius-full: 9999px;

      /* Glass Surface */
      --glass-blur: blur(12px);
    }

    /* 2. Light Theme (Default) */
    :root {
      --primary-accent: #667eea;
      --secondary-accent: #764ba2;
      --success-accent: #5ae4a8;
      --primary-gradient: linear-gradient(135deg, var(--primary-accent) 0%, var(--secondary-accent) 100%);
      
      --text-primary: #2d3748;
      --text-secondary: #4a5568;
      --text-on-accent: #ffffff;
      
      --surface-background: rgba(255, 255, 255, 0.6);
      --surface-border: 1px solid rgba(255, 255, 255, 0.3);
      --surface-nested: #f0f2f5;
    }

    /* 3. Dark Theme */
    body[data-theme='dark'] {
      --primary-accent: #8b9ff9;
      --secondary-accent: #9d7cc8;
      --success-accent: #5ae4a8;

      --text-primary: #e2e8f0;
      --text-secondary: #a0aec0;
      --text-on-accent: #1a202c;

      --surface-background: rgba(26, 32, 44, 0.7);
      --surface-border: 1px solid rgba(255, 255, 255, 0.1);
      --surface-nested: #2d3748;
    }

    /* 4. Dynamic Overrides from Host Page */
    :root {
      ${cssOverrides}
    }

    /* Base Styles */
    body {
      margin: 0;
      height: 100vh;
      display: flex;
      flex-direction: column;
      font-family: var(--font-family);
      background: transparent; /* Let the parent control the background */
    }

    .chat-container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: var(--surface-background);
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      border: var(--surface-border);
      border-radius: var(--radius-container);
      color: var(--text-primary);
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .message {
      max-width: 85%;
      padding: 10px 14px;
      border-radius: var(--radius-interactive);
      line-height: 1.5;
      word-wrap: break-word;
      transition: all 0.2s ease;
    }
    
    .user-message {
      background: var(--primary-gradient);
      color: var(--text-on-accent);
      align-self: flex-end;
      border-bottom-right-radius: var(--radius-small);
    }
    
    .ai-message {
      background: var(--surface-nested);
      color: var(--text-secondary);
      align-self: flex-start;
      border-bottom-left-radius: var(--radius-small);
    }
    
    .ai-message ol, .ai-message ul {
      padding-left: 20px;
      margin: 8px 0;
    }
    
    .ai-message li {
      margin-bottom: 6px;
    }
    
    .ai-message code {
      background: rgba(0,0,0,0.08);
      padding: 3px 5px;
      border-radius: var(--radius-small);
      font-family: monospace;
      font-size: 0.9em;
    }

    body[data-theme='dark'] .ai-message code {
      background: rgba(255,255,255,0.1);
    }
    
    .input-area {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      border-top: var(--surface-border);
    }
    
    #chat-input {
      flex: 1;
      padding: 10px 16px;
      border: none;
      border-radius: var(--radius-full);
      font-size: 16px;
      outline: none;
      background: var(--surface-nested);
      color: var(--text-primary);
      transition: all 0.2s ease;
    }
    
    #chat-input:focus {
      box-shadow: 0 0 0 2px var(--primary-accent);
    }
    
    #send-button {
      background: var(--primary-gradient);
      color: var(--text-on-accent);
      border: none;
      border-radius: var(--radius-full);
      width: 44px;
      height: 44px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease;
      flex-shrink: 0;
    }
    
    #send-button:hover {
      transform: scale(1.05);
    }

    #send-button svg {
        width: 24px;
        height: 24px;
    }
    
    .typing-indicator {
      display: none;
      padding: 10px 14px;
      background: var(--surface-nested);
      border-radius: var(--radius-interactive);
      border-bottom-left-radius: var(--radius-small);
      align-self: flex-start;
    }
    
    .typing-indicator.visible {
      display: flex;
      gap: 5px;
      align-items: center;
    }
    
    .dot {
      width: 8px;
      height: 8px;
      border-radius: var(--radius-full);
      background: var(--text-secondary);
      animation: typing 1.4s infinite ease-in-out;
    }
    
    .dot:nth-child(1) { animation-delay: 0s; }
    .dot:nth-child(2) { animation-delay: 0.2s; }
    .dot:nth-child(3) { animation-delay: 0.4s; }
    
    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-5px); }
    }

    /* Scrollbar Styles */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: var(--text-secondary);
      border-radius: var(--radius-full);
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--primary-accent);
    }
  </style>
</head>
<body data-theme="${theme}">
  <div class="chat-container">
    <div class="messages" id="messages">
      <!-- Welcome message will be loaded here -->
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
    
    // Simple function to convert markdown to HTML
    function markdownToHtml(text) {
      if (!text) return '';
      
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
      
      return text;
    }
    
    // Keep track of conversation history
    let conversationHistory = [];
    const MAX_HISTORY = 10; // Keep last 5 exchanges (10 messages)
    
    // Load conversation history from localStorage if available
    const loadConversationHistory = async (forceWelcome) => {
      const savedHistory = localStorage.getItem('azzarChatHistory');
      let lang = window.parent.azzarChatCurrentLang || 'en';
      let welcomeMsg = '';
      
      // Fetch welcome message from API with an absolute URL
      try {
        const resp = await fetch(workerOrigin + '/api/welcome-message?lang=' + encodeURIComponent(lang));
        if (resp.ok) {
          const data = await resp.json();
          welcomeMsg = data.welcome || '';
        }
      } catch (e) {
        // ignore
      }

      if (!welcomeMsg) {
        welcomeMsg = lang === 'id' ? 'Halo! Saya FREA, asisten AI Anda. Ada yang bisa saya bantu?' : 'Hi! I am FREA, your AI assistant. How can I help you?';
      }

      if (savedHistory && !forceWelcome) {
        try {
          conversationHistory = JSON.parse(savedHistory);
          // Display saved messages (clear first to avoid duplicating welcome message)
          messagesContainer.innerHTML = '';
          conversationHistory.forEach(msg => {
            addMessageToUI(msg.role === 'user' ? 'user' : 'ai', msg.content);
          });
        } catch (e) {
          console.error('Error loading chat history:', e);
          conversationHistory = [{
            role: 'assistant',
            content: welcomeMsg
          }];
          messagesContainer.innerHTML = '';
          addMessageToUI('ai', welcomeMsg);
        }
      } else {
        // Initialize with welcome message if no history exists or forceWelcome
        conversationHistory = [{
          role: 'assistant',
          content: welcomeMsg
        }];
        messagesContainer.innerHTML = '';
        addMessageToUI('ai', welcomeMsg);
      }
      // Save the initial history
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
      // Reload conversation history, which includes fetching a new welcome message
      loadConversationHistory(true);
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