/**
 * Pixelr (Pixel Art) application module for DEVDEBUG OS
 * Enhanced Version with Undo, Redo, Flood Fill, and Export.
 */

export function initializePixelrWindow(windowElement) {
    windowElement.querySelector('.window-content').innerHTML = `
        <div class="flex flex-col h-full bg-black">
            <!-- Top Action Bar -->
            <div class="flex items-center justify-between p-2 border-b border-gray-800" style="background-color: var(--primary-color-darker);">
                <div class="flex space-x-2">
                    <button id="pixelr-undo" title="Undo" class="pixelr-action-btn p-1.5"><i data-lucide="undo" class="w-4 h-4 pointer-events-none"></i></button>
                    <button id="pixelr-redo" title="Redo" class="pixelr-action-btn p-1.5"><i data-lucide="redo" class="w-4 h-4 pointer-events-none"></i></button>
                </div>
                <div class="flex space-x-2">
                    <button id="pixelr-export" title="Export PNG" class="pixelr-action-btn p-1.5 bg-green-900/30 text-green-400 border border-green-500/30 flex items-center justify-center"><i data-lucide="download" class="w-4 h-4 mr-1 pointer-events-none"></i><span class="text-xs font-bold pointer-events-none">SAVE</span></button>
                </div>
            </div>

            <div class="flex flex-grow overflow-hidden">
                <!-- Toolbar (Side) -->
                <div class="w-16 flex-shrink-0 p-2 flex flex-col space-y-6 overflow-y-auto" style="background-color: var(--primary-color-darker); border-right: 1px solid var(--primary-color-dark);">
                    <!-- Tools Section -->
                    <div>
                        <div class="grid grid-cols-1 gap-3">
                            <button id="tool-pencil" title="Pencil" class="pixelr-tool active p-2.5 flex items-center justify-center rounded-md cursor-pointer"><i data-lucide="pencil" class="w-5 h-5 pointer-events-none"></i></button>
                            <button id="tool-bucket" title="Flood Fill" class="pixelr-tool p-2.5 flex items-center justify-center rounded-md cursor-pointer"><i data-lucide="paint-bucket" class="w-5 h-5 pointer-events-none"></i></button>
                            <button id="tool-eraser" title="Eraser" class="pixelr-tool p-2.5 flex items-center justify-center rounded-md cursor-pointer"><i data-lucide="eraser" class="w-5 h-5 pointer-events-none"></i></button>
                            <button id="pixelr-clear" title="Clear Canvas" class="pixelr-action-btn p-2.5 text-orange-500 flex items-center justify-center border border-dashed border-orange-900/50 hover:border-orange-500/50 rounded-md"><i data-lucide="trash-2" class="w-5 h-5 pointer-events-none"></i></button>
                        </div>
                    </div>
                    
                    <!-- Color Section -->
                    <div class="flex flex-col items-center">
                        <div id="color-palette" class="grid grid-cols-2 gap-2 mb-4">
                            <!-- Color swatches injected here -->
                        </div>
                        <div class="relative group">
                            <input type="color" id="pixelr-custom-color" class="w-10 h-10 border-none bg-transparent cursor-pointer rounded-full overflow-hidden" title="Custom Color">
                        </div>
                    </div>
                </div>

                <!-- Canvas Area -->
                <div id="pixelr-canvas-container" class="flex-grow flex items-center justify-center p-4 overflow-auto relative bg-[#050905]">
                    <div class="relative shadow-2xl" id="canvas-wrapper">
                         <canvas id="pixelr-canvas" class="cursor-crosshair"></canvas>
                         <canvas id="pixelr-grid-canvas" class="absolute top-0 left-0 pointer-events-none opacity-20"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;

    const canvas = windowElement.querySelector('#pixelr-canvas');
    const gridCanvas = windowElement.querySelector('#pixelr-grid-canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const gCtx = gridCanvas.getContext('2d');
    const paletteContainer = windowElement.querySelector('#color-palette');
    const customColorInput = windowElement.querySelector('#pixelr-custom-color');

    // Configuration
    const GRID_SIZE = 32;
    const PIXEL_SCALE = 15;
    const CANVAS_DIM = GRID_SIZE * PIXEL_SCALE;

    canvas.width = gridCanvas.width = CANVAS_DIM;
    canvas.height = gridCanvas.height = CANVAS_DIM;

    // State
    let isDrawing = false;
    let activeColor = '#00FF41';
    let activeTool = 'pencil';
    let showGrid = true;
    let history = [];
    let historyIndex = -1;

    // Default Palette
    const colors = ['#FFFFFF', '#000000', '#FF4500', '#00FF41', '#00FFFF', '#FF00FF', '#FFFF00', '#1E90FF'];
    colors.forEach((color, index) => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch-modern p-0.5 rounded-sm cursor-pointer border-2 border-transparent hover:border-white transition-all';
        swatch.style.width = '20px';
        swatch.style.height = '20px';
        swatch.style.backgroundColor = color;
        swatch.dataset.color = color;
        if (color === activeColor) swatch.classList.add('active-swatch');
        paletteContainer.appendChild(swatch);
    });

    // --- Helper Functions ---

    function drawGrid() {
        gCtx.clearRect(0, 0, CANVAS_DIM, CANVAS_DIM);
        if (!showGrid) return;
        gCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        gCtx.lineWidth = 0.5;
        for (let i = 0; i <= GRID_SIZE; i++) {
            gCtx.beginPath();
            gCtx.moveTo(i * PIXEL_SCALE, 0);
            gCtx.lineTo(i * PIXEL_SCALE, CANVAS_DIM);
            gCtx.stroke();
            gCtx.beginPath();
            gCtx.moveTo(0, i * PIXEL_SCALE);
            gCtx.lineTo(CANVAS_DIM, i * PIXEL_SCALE);
            gCtx.stroke();
        }
    }

    function saveToHistory() {
        const snapshot = ctx.getImageData(0, 0, CANVAS_DIM, CANVAS_DIM);
        if (historyIndex < history.length - 1) {
            history = history.slice(0, historyIndex + 1);
        }
        history.push(snapshot);
        if (history.length > 50) history.shift();
        else historyIndex++;
    }

    function undo() {
        if (historyIndex > 0) {
            historyIndex--;
            ctx.putImageData(history[historyIndex], 0, 0);
        }
    }

    function redo() {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            ctx.putImageData(history[historyIndex], 0, 0);
        }
    }

    function hexToRgba(hex) {
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b, 255];
    }

    function floodFill(startX, startY, fillColorHex) {
        const imgData = ctx.getImageData(0, 0, CANVAS_DIM, CANVAS_DIM);
        const pixels = imgData.data;
        const startPos = (startY * PIXEL_SCALE * CANVAS_DIM + startX * PIXEL_SCALE) * 4;
        const startR = pixels[startPos], startG = pixels[startPos + 1], startB = pixels[startPos + 2], startA = pixels[startPos + 3];

        const fillColor = hexToRgba(fillColorHex);
        if (startR === fillColor[0] && startG === fillColor[1] && startB === fillColor[2] && startA === fillColor[3]) return;

        const stack = [[startX, startY]];
        const visited = new Uint8Array(GRID_SIZE * GRID_SIZE);

        ctx.fillStyle = fillColorHex;

        while (stack.length > 0) {
            const [x, y] = stack.pop();
            if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) continue;
            if (visited[y * GRID_SIZE + x]) continue;
            visited[y * GRID_SIZE + x] = 1;

            const pos = (y * PIXEL_SCALE * CANVAS_DIM + x * PIXEL_SCALE) * 4;
            if (pixels[pos] === startR && pixels[pos + 1] === startG && pixels[pos + 2] === startB && pixels[pos + 3] === startA) {
                ctx.fillRect(x * PIXEL_SCALE, y * PIXEL_SCALE, PIXEL_SCALE, PIXEL_SCALE);
                stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
            }
        }
        saveToHistory();
    }

    function drawPixel(e) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / PIXEL_SCALE);
        const y = Math.floor((e.clientY - rect.top) / PIXEL_SCALE);

        if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return;

        if (activeTool === 'bucket') {
            floodFill(x, y, activeColor);
            return;
        }

        if (activeTool === 'pencil' || activeTool === 'eraser') {
            ctx.fillStyle = activeTool === 'pencil' ? activeColor : 'rgba(0,0,0,0)';
            if (activeTool === 'eraser') {
                ctx.clearRect(x * PIXEL_SCALE, y * PIXEL_SCALE, PIXEL_SCALE, PIXEL_SCALE);
            } else {
                ctx.fillRect(x * PIXEL_SCALE, y * PIXEL_SCALE, PIXEL_SCALE, PIXEL_SCALE);
            }
        }
    }

    // --- Listeners ---

    canvas.addEventListener('mousedown', (e) => {
        if (activeTool === 'bucket') {
            drawPixel(e);
        } else {
            isDrawing = true;
            drawPixel(e);
        }
    });

    windowElement.addEventListener('mousemove', (e) => {
        if (isDrawing) drawPixel(e);
    });

    const stopDrawing = () => {
        if (isDrawing) {
            isDrawing = false;
            saveToHistory();
        }
    };

    document.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    // Toolbar logic
    windowElement.addEventListener('click', (e) => {
        const toolBtn = e.target.closest('.pixelr-tool');
        const actionBtn = e.target.closest('.pixelr-action-btn');
        const swatch = e.target.closest('.color-swatch-modern');

        if (toolBtn) {
            windowElement.querySelectorAll('.pixelr-tool').forEach(b => b.classList.remove('active'));
            toolBtn.classList.add('active');
            activeTool = toolBtn.id.split('-')[1];
        }

        if (actionBtn) {
            const action = actionBtn.id.split('-')[1];
            if (action === 'undo') undo();
            if (action === 'redo') redo();
            if (action === 'clear') {
                ctx.clearRect(0, 0, CANVAS_DIM, CANVAS_DIM);
                saveToHistory();
            }
            if (action === 'export') {
                const link = document.createElement('a');
                link.download = 'pixel-art.png';
                link.href = canvas.toDataURL();
                link.click();
            }
        }

        if (swatch) {
            windowElement.querySelectorAll('.color-swatch-modern').forEach(s => s.classList.remove('active-swatch'));
            swatch.classList.add('active-swatch');
            activeColor = swatch.dataset.color;
            customColorInput.value = activeColor;
        }
    });

    customColorInput.addEventListener('input', (e) => {
        activeColor = e.target.value;
        windowElement.querySelectorAll('.color-swatch-modern').forEach(s => s.classList.remove('active-swatch'));
    });

    // --- Init ---
    saveToHistory();
    drawGrid();
    lucide.createIcons({ nodes: windowElement.querySelectorAll('[data-lucide]') });

    windowElement.cleanup = () => {
        document.removeEventListener('mouseup', stopDrawing);
    };
}
