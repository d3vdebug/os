/**
 * Notepad application module for DEVDEBUG OS
 */

/**
 * Initializes the Notepad window.
 * @param {HTMLElement} windowElement - The window element to initialize.
 * @param {Object} system - System dependencies.
 */
export function initializeNotesWindow(windowElement, system) {
    const { fileSystem, WindowManager, focusWindow } = system;

    windowElement.querySelector('.window-content').innerHTML = `
              <div class="flex flex-col h-full">
                  <!-- Toolbar -->
                  <div class="flex-shrink-0 p-1 flex items-center space-x-1" style="background-color: var(--primary-color-darker); border-bottom: 1px solid var(--primary-color-dark);">
                      <button id="notes-new-btn" title="New File" class="px-2 py-1 text-xs hover:bg-gray-700 rounded-sm flex items-center space-x-1"><i data-lucide="file-plus-2" class="w-4 h-4"></i><span>New</span></button>
                      <button id="notes-save-btn" title="Save File" class="px-2 py-1 text-xs hover:bg-gray-700 rounded-sm flex items-center space-x-1"><i data-lucide="save" class="w-4 h-4"></i><span>Save</span></button>
                  </div>
                  <!-- Text Area -->
                  <textarea id="notes-textarea" class="w-full h-full p-3 bg-black text-sm resize-none focus:outline-none" style="color: var(--text-color-dim);"
                      placeholder="File > New to start, or open a file from the File Explorer."></textarea>
              </div>
          `;

    const textarea = windowElement.querySelector('#notes-textarea');
    const newBtn = windowElement.querySelector('#notes-new-btn');
    const saveBtn = windowElement.querySelector('#notes-save-btn');

    lucide.createIcons({ nodes: windowElement.querySelectorAll('[data-lucide]') });

    // New File
    newBtn.addEventListener('click', () => {
        textarea.value = '';
        textarea.dataset.currentPath = ''; // Clear current path
        windowElement.querySelector('.title-bar span').textContent = 'Notepad - Untitled';
        textarea.placeholder = "Type something...";
        textarea.focus();
    });

    // Save File
    saveBtn.addEventListener('click', () => {
        let path = textarea.dataset.currentPath;
        const content = textarea.value;

        if (path) { // If a file is already open, save it
            const pathParts = path.split('/').filter(p => p);
            const fileName = pathParts.pop();
            let current = fileSystem.root;
            for (const part of pathParts) {
                current = current.children[part];
            }
            if (current && current.children[fileName]) {
                current.children[fileName].content = content;
                // Visual feedback
            } else {
                alert('Error: Could not find file path to save.');
            }
        } else { // If it's a new file, prompt for a name and save
            showSaveAsDialog(windowElement, content, system);
        }
    });
}

/**
 * Shows a custom "Save As" dialog for the Notepad app.
 * @param {HTMLElement} notesWindowElement - The parent Notepad window element.
 * @param {string} contentToSave - The text content to be saved.
 * @param {Object} system - System dependencies.
 */
export function showSaveAsDialog(notesWindowElement, contentToSave, system) {
    const { fileSystem, WindowManager, focusWindow } = system;

    // Create a unique ID for the dialog to prevent conflicts
    const dialogId = `save-dialog-${Date.now()}`;
    const dialog = document.createElement('div');
    dialog.id = dialogId;
    dialog.className = 'window p-0'; // Use the same base class as other windows
    dialog.style.width = '350px';
    dialog.style.height = '200px';
    dialog.style.top = '30vh';
    dialog.style.left = 'calc(50vw - 175px)'; // Center it
    focusWindow(dialog); // Bring it to the front

    dialog.innerHTML = `
              <div class="title-bar p-2 flex items-center justify-between text-sm font-semibold">
                  <span>Save As</span>
                  <button class="close-btn w-6 h-6 rounded-none flex items-center justify-center">X</button>
              </div>
              <div class="window-content p-4 flex flex-col justify-between">
                  <div class="space-y-2">
                      <label for="save-filename" class="text-sm" style="color: var(--text-color-dim);">File name:</label>
                      <input type="text" id="save-filename" value="new_note.txt" class="w-full p-2 bg-black text-sm focus:outline-none focus:ring-1" style="color: var(--primary-color); border: 1px solid var(--primary-color-dark); --ring-color: var(--primary-color);">
                      <p class="text-xs" style="color: var(--text-color-dim);">Save in: /users/DevDebug/</p>
                  </div>
                  <div class="flex justify-end space-x-2">
                      <button id="save-cancel-btn" class="px-4 py-1 text-sm" style="background-color: var(--primary-color-dark);">Cancel</button>
                      <button id="save-confirm-btn" class="px-4 py-1 text-sm text-black font-bold" style="background-color: var(--primary-color);">Save</button>
                  </div>
              </div>
          `;

    WindowManager.desktop.appendChild(dialog);

    const closeDialog = () => dialog.remove();

    dialog.querySelector('.close-btn').addEventListener('click', closeDialog);
    dialog.querySelector('#save-cancel-btn').addEventListener('click', closeDialog);

    dialog.querySelector('#save-confirm-btn').addEventListener('click', () => {
        const fileName = dialog.querySelector('#save-filename').value.trim();
        if (fileName) {
            const newPath = `/users/DevDebug/${fileName}`;
            // Check for existing file could be added here
            fileSystem.root.children.users.children.DevDebug.children[fileName] = { type: 'file', content: contentToSave };

            const notesTextarea = notesWindowElement.querySelector('#notes-textarea');
            notesTextarea.dataset.currentPath = newPath;
            notesWindowElement.querySelector('.title-bar span').textContent = `Notepad - ${fileName}`;

            closeDialog();
        } else {
            alert("File name cannot be empty.");
        }
    });

    dialog.querySelector('#save-filename').focus();
}
