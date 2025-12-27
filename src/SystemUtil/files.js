/**
 * File Explorer application module for DEVDEBUG OS
 */

/**
 * Initializes the File Explorer (Files) window.
 * @param {HTMLElement} windowElement - The window element to initialize.
 * @param {Object} system - System dependencies.
 */
export function initializeFilesWindow(windowElement, system) {
    const { fileSystem, openApp, WindowManager, focusWindow } = system;

    const getPathObject = (path) => {
        const parts = path.split('/').filter(p => p);
        let current = fileSystem.root;
        for (const part of parts) {
            if (current && current.type === 'folder' && current.children[part]) {
                current = current.children[part];
            } else {
                return null; // Path not found
            }
        }
        return current;
    };

    const renderExplorer = (path) => {
        const pathObject = getPathObject(path);
        if (!pathObject || pathObject.type !== 'folder') {
            // Handle error or invalid path
            windowElement.querySelector('.window-content').innerHTML = `<div class="p-4 text-red-500">Error: Path not found or is not a directory.</div>`;
            return;
        }

        let filesHtml = '';
        const children = pathObject.children;
        // Sort folders first, then files
        const sortedKeys = Object.keys(children).sort((a, b) => {
            const aIsFolder = children[a].type === 'folder';
            const bIsFolder = children[b].type === 'folder';
            if (aIsFolder && !bIsFolder) return -1;
            if (!aIsFolder && bIsFolder) return 1;
            return a.localeCompare(b);
        });

        for (const name of sortedKeys) {
            const item = children[name];
            const icon = item.type === 'folder' ? 'folder' : 'file-text';
            filesHtml += `
                      <li class="p-1 flex items-center space-x-2 cursor-pointer hover:bg-green-900 rounded-sm" data-name="${name}" data-type="${item.type}">
                          <i data-lucide="${icon}" class="w-4 h-4 flex-shrink-0"></i>
                          <span>${name}</span>
                      </li>
                  `;
        }

        const parentPath = path.substring(0, path.lastIndexOf('/')) || '/';
        const isRoot = path === '/';

        windowElement.querySelector('.window-content').innerHTML = `
                  <div class="flex flex-col h-full">
                      <div class="p-2 flex items-center space-x-2 flex-shrink-0" style="background-color: var(--primary-color-darker); border-bottom: 1px solid var(--primary-color-dark);">
                          <button id="fs-back-btn" title="Up" ${isRoot ? 'disabled' : ''} data-path="${parentPath}" class="font-bold py-1 px-2 rounded-none transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed" style="background-color: var(--primary-color-dark); color: var(--text-color-dim); border: 1px solid var(--primary-color-dark);">&#9650;</button>
                          <span class="text-sm truncate" style="color: var(--text-color-dim);">${path === '/' ? '/root' : path}</span>
                      </div>
                      <ul id="file-list" class="flex-grow p-2 space-y-1 text-sm overflow-y-auto" style="color: var(--text-color-dim);">
                          ${filesHtml || '<li class="p-2 text-gray-500 italic">This folder is empty.</li>'}
                      </ul>
                  </div>
              `;

        if (window.lucide) {
            window.lucide.createIcons({ nodes: windowElement.querySelectorAll('[data-lucide]') });
        }

        // Add event listeners
        windowElement.querySelector('#fs-back-btn').addEventListener('click', (e) => {
            if (!e.currentTarget.disabled) {
                renderExplorer(e.currentTarget.dataset.path);
            }
        });

        windowElement.querySelector('#file-list').addEventListener('click', (e) => {
            const target = e.target.closest('li');
            if (!target) return;

            const name = target.dataset.name;
            const type = target.dataset.type;
            const newPath = (path === '/' ? '' : path) + '/' + name;

            if (type === 'folder') {
                renderExplorer(newPath);
            } else {
                // Open file in notepad
                if (typeof openApp === 'function') {
                    openApp('notes');
                    // Use a timeout to ensure the app is open before we populate it
                    setTimeout(() => {
                        const notesWindow = WindowManager.openWindows['notes'];
                        if (notesWindow) {
                            const textarea = notesWindow.querySelector('textarea');
                            const fileName = newPath.split('/').pop();
                            const fileObj = getPathObject(newPath);
                            if (fileObj) {
                                textarea.value = fileObj.content || '';
                                textarea.dataset.currentPath = newPath; // Store the path
                                notesWindow.querySelector('.title-bar span').textContent = `Notepad - ${fileName}`;
                                if (typeof focusWindow === 'function') {
                                    focusWindow(notesWindow);
                                }
                            }
                        }
                    }, 100);
                }
            }
        });
    };

    renderExplorer('/'); // Start at the root
}
