/**
 * Browser application module for DEVDEBUG OS
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
 * Loads a specific history state into the browser window.
 * @param {HTMLElement} windowElement - The browser window element.
 * @param {Object} state - The history state to load.
 */
function loadHistoryState(windowElement, state) {
    const contentArea = windowElement.querySelector('#browser-content-area');
    const urlInput = windowElement.querySelector('#browser-url');
    const backButton = windowElement.querySelector('#browser-back-btn');
    const forwardButton = windowElement.querySelector('#browser-forward-btn');
    urlInput.value = state.query;
    contentArea.innerHTML = state.htmlContent;
    backButton.disabled = windowElement.historyIndex <= 0;
    forwardButton.disabled = windowElement.historyIndex >= windowElement.browserHistory.length - 1;
}

/**
 * Goes back in the browser history.
 * @param {HTMLElement} windowElement - The browser window element.
 */
function goBack(windowElement) {
    if (windowElement.historyIndex > 0) {
        windowElement.historyIndex--;
        loadHistoryState(windowElement, windowElement.browserHistory[windowElement.historyIndex]);
    }
}

/**
 * Goes forward in the browser history.
 * @param {HTMLElement} windowElement - The browser window element.
 */
function goForward(windowElement) {
    if (windowElement.historyIndex < windowElement.browserHistory.length - 1) {
        windowElement.historyIndex++;
        loadHistoryState(windowElement, windowElement.browserHistory[windowElement.historyIndex]);
    }
}

/**
 * Performs a search or navigates to a URL.
 * @param {HTMLElement} windowElement - The browser window element.
 * @param {string} query - The search query or URL.
 * @param {boolean} isInternal - Whether this is an internal call (e.g., refresh).
 * @param {Object} system - System dependencies.
 */
export async function navigateOrSearch(windowElement, query, isInternal = false, system = {}) {
    const { API_CONFIG } = system;
    const contentArea = windowElement.querySelector('#browser-content-area');
    const urlInput = windowElement.querySelector('#browser-url');
    const searchButton = windowElement.querySelector('#browser-search-btn');
    const progressBar = windowElement.querySelector('#browser-progress-bar');
    const originalQuery = query;

    let isURL = query.toLowerCase().startsWith('http://') || query.toLowerCase().startsWith('https://') || query.toLowerCase().startsWith('www.');

    if (isURL && !isInternal) {
        if (query.match(/google\.com|bing\.com|yahoo\.com/i)) {
            contentArea.innerHTML = `
                      <div class="text-center p-8" style="background-color: rgba(255,0,0,0.1); border: 1px solid var(--danger-color);">
                          <h3 class="text-xl font-bold mb-3" style="color: var(--danger-color);">SECURITY BREACH DETECTED: ACCESS DENIED</h3>
                          <p style="color: var(--danger-color); opacity: 0.8;">Direct external URL access is restricted by DEVDEBUG OS kernel policies.</p>
                          <p class="text-green-500 text-opacity-70 mt-3">Hint: Use the search bar for queries, not full URLs.</p>
                      </div>
                  `;
            urlInput.disabled = false;
            searchButton.disabled = false;
            searchButton.innerHTML = 'GO';
            urlInput.focus();
            return;
        }
    }

    if (isURL) {
        contentArea.innerHTML = `<div class="text-center p-8" style="background-color: var(--primary-color-darker); border: 1px solid var(--primary-color-dark);"><h3 class="text-xl font-bold mb-3" style="color: var(--primary-color);">Processing: ${query}</h3><p style="color: var(--text-color-dim); opacity: 0.7;">(Simulation protocol restricts direct external page access. Displaying a data summary.)</p></div>`;
        query = query.replace(/^(https?:\/\/)?(www\.)?/, '');
    } else {
        contentArea.innerHTML = `<div class="text-center p-8" style="color: var(--text-color-dim);">Executing SEARCH for "${query}"...</div>`;
    }

    urlInput.disabled = true;
    searchButton.disabled = true;
    searchButton.innerHTML = '<span class="text-red-500 font-mono">STOP</span>';

    windowElement.querySelector('#browser-refresh-btn').disabled = true;

    progressBar.classList.remove('hidden');
    progressBar.style.width = '0%';

    await new Promise(resolve => setTimeout(resolve, 100));
    progressBar.style.width = '50%';

    const systemPrompt = "You are a web search engine assistant. Summarize the requested information concisely and clearly based on the web results provided. Do not include a conversational preamble or sign-off, just the information.";

    const payload = {
        contents: [{ parts: [{ text: query }] }],
        tools: [{ "google_search": {} }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };

    let finalHtmlContent = '';

    try {
        const response = await exponentialBackoffFetch(API_CONFIG.GEMINI.URL + API_CONFIG.GEMINI.KEY, options);
        const result = await response.json();
        const candidate = result.candidates?.[0];

        if (candidate && candidate.content?.parts?.[0]?.text) {
            const text = candidate.content.parts[0].text;
            let sources = [];
            const groundingMetadata = candidate.groundingMetadata;

            if (groundingMetadata && groundingMetadata.groundingAttributions) {
                sources = groundingMetadata.groundingAttributions
                    .map(attribution => ({
                        uri: attribution.web?.uri,
                        title: attribution.web?.title,
                    }))
                    .filter(source => source.uri && source.title);
            }

            finalHtmlContent = `<h3 class="text-lg font-bold mb-3" style="color: var(--primary-color);">${isURL ? 'DATA_STREAM for ' + originalQuery : 'SEARCH RESULTS for: "' + query + '"'}</h3>`;
            finalHtmlContent += `<div class="p-4 mb-4 leading-relaxed" style="background-color: var(--primary-color-darker); border: 1px solid var(--primary-color-dark);">${formatMarkdown(text)}</div>`;

            if (sources.length > 0) {
                finalHtmlContent += `<h4 class="text-sm font-semibold mb-2" style="color: var(--text-color-dim);">ATTRIBUTION:</h4>`;
                finalHtmlContent += `<ul class="list-disc list-inside space-y-1 text-xs pl-4">`;
                sources.forEach((source, index) => {
                    finalHtmlContent += `<li><a href="#" data-internal-link="${source.uri}" class="internal-link transition-colors" style="color: var(--accent-color);" title="${source.uri}">[${index + 1}] ${source.title}</a></li>`;
                });
                finalHtmlContent += `</ul>`;
            }

            contentArea.innerHTML = finalHtmlContent;

        } else {
            finalHtmlContent = `<div class="text-red-500 p-4">ACCESS DENIED: Could not retrieve external data for "${query}".</div>`;
            contentArea.innerHTML = finalHtmlContent;
        }

    } catch (error) {
        console.error("Browser Search Error:", error);
        finalHtmlContent = `<div style="color: var(--danger-color);" class="p-4">API CONNECTION ERROR: ${error.message}. Check console for details.</div>`;
        contentArea.innerHTML = finalHtmlContent;
    } finally {
        progressBar.style.width = '100%';
        await new Promise(resolve => setTimeout(resolve, 200));
        progressBar.classList.add('hidden');

        urlInput.disabled = false;
        searchButton.disabled = false;
        searchButton.innerHTML = 'GO';
        if (windowElement.querySelector('#browser-refresh-btn')) {
            windowElement.querySelector('#browser-refresh-btn').disabled = false;
        }
        urlInput.focus();

        if (!isInternal) {
            const newState = { query: originalQuery, htmlContent: finalHtmlContent };

            if (windowElement.historyIndex < windowElement.browserHistory.length - 1) {
                windowElement.browserHistory = windowElement.browserHistory.slice(0, windowElement.historyIndex + 1);
            }

            windowElement.browserHistory.push(newState);
            windowElement.historyIndex = windowElement.browserHistory.length - 1;

            const backButton = windowElement.querySelector('#browser-back-btn');
            const forwardButton = windowElement.querySelector('#browser-forward-btn');
            if (backButton) backButton.disabled = windowElement.historyIndex <= 0;
            if (forwardButton) forwardButton.disabled = true;
        }
    }
}

/**
 * Initializes the browser window.
 * @param {HTMLElement} windowElement - The window element to initialize.
 * @param {Object} system - System dependencies.
 */
export function initializeBrowserWindow(windowElement, system) {
    const { API_CONFIG } = system;
    windowElement.browserHistory = [];
    windowElement.historyIndex = -1;

    windowElement.querySelector('.window-content').innerHTML = `
              <div class="flex flex-col h-full bg-black">
                  <!-- Address Bar and Navigation Controls -->
                  <div class="p-2 flex-shrink-0" style="background-color: var(--primary-color-darker); border-bottom: 1px solid var(--primary-color-dark);">
                      <div class="flex items-center space-x-1">
                          <!-- Navigation Buttons -->
                          <button id="browser-back-btn" title="Back" disabled
                              class="font-bold py-1 px-2 rounded-none transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed" style="background-color: var(--primary-color-dark); color: var(--text-color-dim); border: 1px solid var(--primary-color-dark);">
                              &#9664;
                          </button>
                          <button id="browser-forward-btn" title="Forward" disabled
                              class="font-bold py-1 px-2 rounded-none transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed" style="background-color: var(--primary-color-dark); color: var(--text-color-dim); border: 1px solid var(--primary-color-dark);">
                              &#9654;
                          </button>
                          <!-- Refresh Button -->
                          <button id="browser-refresh-btn" title="Refresh"
                              class="font-bold py-1 px-2 rounded-none transition-colors text-sm" style="background-color: var(--primary-color-dark); color: var(--text-color-dim); border: 1px solid var(--primary-color-dark);">
                              &#x21BB;
                          </button>
                          
                          <!-- URL/Search Input -->
                          <input type="text" id="browser-url" value=""
                              class="flex-grow p-2 bg-black rounded-none focus:ring-1 focus:outline-none text-sm" style="color: var(--primary-color); border: 1px solid var(--primary-color-dark); --ring-color: var(--primary-color);"
                              placeholder="EXECUTE or SEARCH"/>
                              
                          <!-- Go/Refresh/Stop Button -->
                          <button id="browser-search-btn"
                              class="text-black font-bold py-1 px-3 rounded-none transition-colors text-sm border border-black" style="background-color: var(--primary-color);">
                              GO
                          </button>
                      </div>
                      <!-- Loading Progress Bar -->
                      <div id="browser-progress-bar" class="h-0.5 mt-2 hidden transition-all duration-300 ease-linear" style="background-color: var(--accent-color);"></div>
                  </div>
                  
                  <!-- Content Area -->
                  <div id="browser-content-area" class="flex-grow overflow-y-auto p-4 bg-black text-sm">
                      <!-- Initial Content -->
                      <div class="p-4" style="background-color: var(--primary-color-darker); border: 1px solid var(--primary-color-dark);">
                          <p class="font-bold mb-1" style="color: var(--primary-color);">:: INITIALIZING WEB ACCESS ::</p>
                          <p style="color: var(--text-color-dim); opacity: 0.7;">Enter a query or target above and execute 'GO' to initiate a Google-grounded data retrieval via the Gemini API.</p>
                      </div>
                  </div>
              </div>
          `;

    const urlInput = windowElement.querySelector('#browser-url');
    const searchButton = windowElement.querySelector('#browser-search-btn');
    const backButton = windowElement.querySelector('#browser-back-btn');
    const forwardButton = windowElement.querySelector('#browser-forward-btn');
    const refreshButton = windowElement.querySelector('#browser-refresh-btn');

    const handleAction = () => {
        const query = urlInput.value.trim();
        if (query) {
            navigateOrSearch(windowElement, query, false, system);
        }
    };

    backButton.addEventListener('click', () => goBack(windowElement));
    forwardButton.addEventListener('click', () => goForward(windowElement));

    const handleRefresh = () => {
        const query = urlInput.value.trim();
        if (query) {
            navigateOrSearch(windowElement, query, true, system);
        }
    };
    refreshButton.addEventListener('click', handleRefresh);

    searchButton.addEventListener('click', handleAction);
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleAction();
        }
    });

    if (window.lucide) {
        window.lucide.createIcons({ nodes: windowElement.querySelectorAll('[data-lucide]') });
    }
}
