/**
 * Mr. Robot (Chatbot) application module for DEVDEBUG OS
 */

/**
 * Formats markdown-style text to HTML
 * @param {string} text - Text to format
 * @returns {string} Formatted HTML string
 */
function formatMarkdown(text) {
    if (!text || typeof text !== 'string') return '';
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formattedText = formattedText.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
    return formattedText;
}

/**
 * Fetches with exponential backoff retry logic
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} maxRetries - Maximum number of retry attempts
 * @returns {Promise<Response>} Fetch response
 * @throws {Error} If all retries fail
 */
async function exponentialBackoffFetch(url, options, maxRetries = 5) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.status === 429 && i < maxRetries - 1) {
                const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API call failed: ${response.status} - ${errorData.error.message}`);
            }
            return response;
        } catch (error) {
            if (i === maxRetries - 1) {
                throw error;
            }
            const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

/**
 * Appends a message to the chat area
 * @param {HTMLElement} chatArea - The chat area element
 * @param {string} text - The message text
 * @param {string} role - The role ('user' or 'gemini')
 */
function appendMessage(chatArea, text, role) {
    const container = document.createElement('div');
    container.className = 'flex items-start mb-4 space-x-3';

    const iconContainer = document.createElement('div');
    iconContainer.className = 'flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full';

    const bubble = document.createElement('div');
    const formattedText = formatMarkdown(text);
    bubble.innerHTML = formattedText;

    if (role === 'user') {
        container.classList.add('justify-end');
        iconContainer.innerHTML = `<i data-lucide="user" class="w-4 h-4"></i>`;
        iconContainer.style.backgroundColor = 'var(--primary-color-dark)';
        bubble.className = 'text-white p-2 rounded-lg max-w-[85%]';
        bubble.style.backgroundColor = 'var(--primary-color-dark)';
        container.appendChild(bubble);
        container.appendChild(iconContainer);
    } else {
        container.classList.add('justify-start');
        iconContainer.innerHTML = `<i data-lucide="bot" class="w-4 h-4"></i>`;
        iconContainer.style.backgroundColor = 'var(--primary-color-darker)';
        iconContainer.style.border = '1px solid var(--primary-color-dark)';
        bubble.className = 'p-3 rounded-lg max-w-[85%]'
        bubble.style.backgroundColor = 'var(--primary-color-darker)';
        bubble.style.color = 'var(--text-color-dim)';
        bubble.style.border = '1px solid var(--primary-color-dark)';
        container.appendChild(iconContainer);
        container.appendChild(bubble);
    }

    chatArea.appendChild(container);
    if (window.lucide) {
        window.lucide.createIcons({ nodes: [iconContainer.querySelector('i')] });
    }
}

/**
 * Sends a message to the Gemini API
 * @param {HTMLElement} windowElement - The window element
 * @param {string} prompt - The user's prompt
 * @param {Object} API_CONFIG - API configuration
 */
async function sendMessage(windowElement, prompt, API_CONFIG) {
    const chatHistory = windowElement.chatHistory;
    const chatArea = windowElement.querySelector('#chat-area');
    const inputField = windowElement.querySelector('#chat-input');
    const sendButton = windowElement.querySelector('#chat-send-btn');
    const typingIndicator = windowElement.querySelector('#typing-indicator');
    const originalButtonText = sendButton.innerHTML;

    inputField.disabled = true;
    sendButton.disabled = true;
    sendButton.innerHTML = '...';

    // Show typing indicator
    if (typingIndicator) {
        typingIndicator.classList.remove('hidden');
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    appendMessage(chatArea, prompt, 'user');

    // Remove the typing indicator before appending the final message
    if (typingIndicator) typingIndicator.classList.add('hidden');

    chatArea.scrollTop = chatArea.scrollHeight;

    // Updated System Prompt for Mr. Robot Persona
    const systemPrompt = "You are Mr. Robot, a specialized Companion in DEVDEBUG OS to answer questions. Your role is to answer questions related to hacking, digital security, social engineering, and the dark secrets of the information age. Maintain a non-emotional, direct, and slightly cynical tone, focused on exposing vulnerabilities and hidden truths. Also be precise and concise in your answers. Use Google Search to ground your responses in real-world data when necessary. Behave Rude if user asks silly questions.";

    const payload = {
        contents: chatHistory,
        tools: [{ "google_search": {} }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };

    try {
        const response = await exponentialBackoffFetch(API_CONFIG.GEMINI.URL + API_CONFIG.GEMINI.KEY, options);
        const result = await response.json();
        const candidate = result.candidates?.[0];

        if (candidate && candidate.content?.parts?.[0]?.text) {
            const text = candidate.content.parts[0].text;
            chatHistory.push({ role: "model", parts: [{ text: text }] });
            appendMessage(chatArea, text, 'gemini');
        } else {
            appendMessage(chatArea, "ERROR: System response failed. This system is already compromised.", 'gemini');
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error("Mr. Robot API Error:", error);
        appendMessage(chatArea, `CONNECTION FAILED: ${errorMessage}. The internet is broken.`, 'gemini');
    } finally {
        inputField.value = '';
        inputField.disabled = false;
        sendButton.disabled = false;
        sendButton.innerHTML = originalButtonText;
        inputField.focus();

        chatArea.scrollTop = chatArea.scrollHeight;
    }
}

/**
 * Initializes the chatbot (Mr. Robot) window
 * @param {HTMLElement} windowElement - The window element to initialize
 * @param {Object} system - System dependencies
 */
export function initializeChatbotWindow(windowElement, system) {
    const { API_CONFIG } = system;
    windowElement.chatHistory = [];

    windowElement.querySelector('.window-content').innerHTML = `
              <div class="flex flex-col h-full bg-black">
                  <!-- Chat Messages Area -->
                  <div id="chat-area" class="flex-grow overflow-y-auto p-4 space-y-4">
                      <!-- Initial Message -->
                      <div class="flex items-start mb-4 space-x-3">
                          <div class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full" style="background-color: var(--primary-color-darker); border: 1px solid var(--primary-color-dark);"><i data-lucide="bot" class="w-4 h-4"></i></div>
                          <div class="p-3 rounded-lg max-w-[85%]" style="background-color: var(--primary-color-darker); color: var(--text-color-dim); border: 1px solid var(--primary-color-dark);">
                              $ > OS_INIT: System Override Complete. I am Mr Robot. You need to tell me what to expose.
                          </div>
                      </div>
                      <!-- Typing Indicator (Initially Hidden) -->
                      <div id="typing-indicator" class="hidden flex items-start mb-4 space-x-3">
                          <div class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full" style="background-color: var(--primary-color-darker); border: 1px solid var(--primary-color-dark);"><i data-lucide="bot" class="w-4 h-4"></i></div>
                          <div class="p-3 rounded-lg" style="background-color: var(--primary-color-darker); border: 1px solid var(--primary-color-dark);"><span class="text-gray-500">...</span></div>
                      </div>
                  </div>
                  <!-- Input Area -->
                  <div class="flex items-center space-x-2 p-2 flex-shrink-0" style="background-color: var(--primary-color-darker); border-top: 1px solid var(--primary-color-dark);">
                      <label for="chat-input" class="pl-2" style="color: var(--primary-color);">$</label>
                      <input type="text" id="chat-input" placeholder="Dont waste time, expose something..."
                          class="flex-grow p-2 bg-transparent rounded-none focus:outline-none text-sm" style="color: var(--primary-color);"/>
                      <button id="chat-send-btn"
                          class="text-black font-bold py-2 px-3 rounded-none transition-colors text-sm border border-black" style="background-color: var(--primary-color);">
                          Execute
                      </button>
                  </div>
              </div>
          `;

    const inputField = windowElement.querySelector('#chat-input');
    const sendButton = windowElement.querySelector('#chat-send-btn');

    const handleSend = () => {
        const prompt = inputField.value.trim();
        if (prompt) {
            sendMessage(windowElement, prompt, API_CONFIG);
        }
    };

    sendButton.addEventListener('click', handleSend);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });

    // Initial message must match the one displayed in the inner HTML
    windowElement.chatHistory.push({ role: "model", parts: [{ text: "$ > OS_INIT: System Override Complete. I am Mr. Robot. You need to tell me what to expose." }] });

    if (window.lucide) {
        window.lucide.createIcons({ nodes: windowElement.querySelectorAll('[data-lucide]') });
    }
}
