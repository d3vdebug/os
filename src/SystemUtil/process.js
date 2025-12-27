/**
 * Process Explorer application module for DEVDEBUG OS
 */

/**
 * Initializes the Process Explorer (SysMon) window.
 * @param {HTMLElement} windowElement - The window element to initialize.
 * @param {Object} system - System dependencies.
 * @param {Object} system.WindowManager - The window manager object.
 * @param {Object} system.apps - The applications configuration object.
 * @param {Function} system.closeApp - Function to close an application.
 */
export function initializeSysMonWindow(windowElement, system) {
    const { WindowManager, apps, closeApp } = system;

    windowElement.querySelector('.window-content').innerHTML = `
              <div class="flex flex-col h-full">
                  <div class="p-2 text-xs border-b bg-gray-900 flex justify-between font-bold" style="border-color: var(--primary-color-dark); background-color: var(--primary-color-darker);">
                      <span>PROCESS_NAME</span>
                      <span>CPU / MEM</span>
                      <span>ACTION</span>
                  </div>
                  <ul id="process-list" class="flex-grow overflow-y-auto text-sm">
                      <!-- Process items will be injected here -->
                  </ul>
              </div>
          `;

    const processList = windowElement.querySelector('#process-list');

    const updateProcesses = () => {
        // Don't update if the window is not visible/focused to save cycles
        if (WindowManager.nextZIndex && parseInt(windowElement.style.zIndex) < WindowManager.nextZIndex - 5) {
            // return; // Optional optimization
        }

        processList.innerHTML = ''; // Clear the list

        for (const appId in WindowManager.openWindows) {
            const appConfig = apps[appId];
            if (!appConfig) continue;

            const li = document.createElement('li');
            li.className = 'flex justify-between items-center p-2 transition-colors';

            // Simulated stats
            const cpu = (Math.random() * (appId === 'snake' ? 25 : 8)).toFixed(2);
            const mem = (Math.random() * 100 + (appId === 'browser' ? 150 : 50)).toFixed(1);

            li.innerHTML = `
                      <span class="w-1/3 truncate" style="color: var(--primary-color);">${appConfig.title}</span>
                      <span class="w-1/3 text-center" style="color: var(--accent-color);">${cpu}% / ${mem}KB</span>
                      <div class="w-1/3 text-right">
                          <button data-appid="${appId}" class="kill-btn font-bold text-xs" style="color: var(--danger-color);">KILL</button>
                      </div>
                  `;
            processList.appendChild(li);
        }
    };

    const intervalId = setInterval(updateProcesses, 1500);
    updateProcesses(); // Initial run

    // Add event listener for kill buttons (using event delegation)
    processList.addEventListener('click', (e) => {
        if (e.target.classList.contains('kill-btn')) {
            const appIdToKill = e.target.dataset.appid;
            if (appIdToKill === 'sysmon') return; // Can't kill itself
            closeApp(appIdToKill);
            updateProcesses(); // Update list immediately after killing
        }
    });

    // Cleanup function to stop the interval when the window is closed
    windowElement.cleanup = () => {
        clearInterval(intervalId);
    };
}
