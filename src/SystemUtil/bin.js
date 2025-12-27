/**
 * Recycle Bin Application
 * @module SystemUtil/bin
 */

/**
 * Initializes the Recycle Bin window.
 * Displays a list of 'deleted' files.
 * 
 * @param {HTMLElement} windowElement - The window element to initialize.
 */
export function initializeBinWindow(windowElement) {
    windowElement.querySelector('.window-content').innerHTML = `
              <div class="flex flex-col h-full">
                  <div class="p-2 text-xs border-b bg-gray-900 font-bold" style="border-color: var(--primary-color-dark); background-color: var(--primary-color-darker);">
                      <span>FILE_NAME</span>
                  </div>
                  <ul id="bin-file-list" class="flex-grow overflow-y-auto text-sm p-2 space-y-1">
                      <!-- Files will be injected here -->
                  </ul>
                  <div id="bin-footer" class="p-2 text-xs text-center" style="background-color: var(--primary-color-darker); border-top: 1px solid var(--primary-color-dark); color: var(--text-color-dim);">
                      5 items marked for deletion.
                  </div>
              </div>
          `;

    const fileListEl = windowElement.querySelector('#bin-file-list');
    const suspiciousFiles = [
        'shadow_creds.bak', 'keylog.dll', 'fsociety.dat', 'exploit_kit.zip', 'proxy_list.txt'
    ];

    suspiciousFiles.forEach(fileName => {
        const li = document.createElement('li');
        li.id = `file-${fileName.replace('.', '-')}`;
        li.className = 'p-1';
        li.style.opacity = '0.5'; // Make it look deleted
        li.innerHTML = `
                  <span style="color: var(--primary-color);">${fileName}</span>
              `;
        fileListEl.appendChild(li);
    });
}
