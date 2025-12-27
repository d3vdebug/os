/**
 * Terminal application module for DEVDEBUG OS
 */

export function initializeTerminalWindow(windowElement, system) {
    const { fileSystem, WindowManager, apps, openApp, closeApp } = system;

    windowElement.querySelector('.window-content').innerHTML = `
              <div id="terminal-output" class="p-2 h-full overflow-y-auto text-sm font-mono whitespace-pre-wrap"></div>
              <div class="flex items-center p-1 flex-shrink-0" style="background-color: var(--primary-color-darker); border-top: 1px solid var(--primary-color-dark);">
                  <span class="pl-2" style="color: var(--primary-color); font-family: 'Consolas', 'Monospace', monospace;">devdebug@os:~$</span>
                  <input type="text" id="terminal-input" class="flex-grow p-1 bg-transparent focus:outline-none text-sm" style="color: var(--primary-color);" autocomplete="off" />
              </div>
          `;

    const outputEl = windowElement.querySelector('#terminal-output');
    const inputEl = windowElement.querySelector('#terminal-input');
    let commandHistory = [];
    let historyIndex = -1;
    let cwd = '/'; // Current Working Directory for the terminal

    const printToTerminal = (text, isCommand = false) => {
        if (isCommand) {
            outputEl.innerHTML += `<span style="color: var(--primary-color);">devdebug@os:~$</span> <span style="color: var(--text-color-dim);">${text}</span>\n`;
        } else {
            outputEl.innerHTML += text + '\n';
        }
        outputEl.scrollTop = outputEl.scrollHeight;
    };

    // Helper to navigate the file system for terminal commands
    const getPathObject = (path, currentDir) => {
        if (!path.startsWith('/')) {
            path = (currentDir === '/' ? '' : currentDir) + '/' + path;
        }
        const parts = path.split('/').filter(p => p);
        let current = fileSystem.root;
        for (const part of parts) {
            if (part === '..') {
                // This is a simplified '..' handler. A real one is more complex.
                // For now, we just go up one level from the absolute path.
                const parentPath = path.substring(0, path.lastIndexOf('/')) || '/';
                return getPathObject(parentPath, '/');
            }
            if (current && current.type === 'folder' && current.children[part]) {
                current = current.children[part];
            } else { return null; }
        }
        return current;
    };

    const commands = {
        help: () => {
            return `Available commands:\n` +
                `  <span style="color: var(--accent-color);">help</span>         - Shows this help message.\n` +
                `  <span style="color: var(--accent-color);">ls</span>           - Lists items on the desktop.\n` +
                `  <span style="color: var(--accent-color);">ps</span>           - Lists active processes.\n` +
                `  <span style="color: var(--accent-color);">open [app_id]</span>  - Opens an application (e.g., 'open browser').\n` +
                `  <span style="color: var(--accent-color);">kill [app_id]</span>  - Terminates a running application (e.g., 'kill browser').\n` +
                `  <span style="color: var(--accent-color);">clear</span>        - Clears the terminal screen.\n` +
                `  <span style="color: var(--accent-color);">echo [text]</span>    - Prints text to the terminal.\n` +
                `  <span style="color: var(--accent-color);">date</span>         - Displays the current date and time.\n` +
                `  <span style="color: var(--accent-color);">neofetch</span>     - Shows system information.\n` +
                `  <span style="color: var(--accent-color);">devdebug</span>     - Displays the OS logo.\n` +
                `  <span style="color: var(--accent-color);">matrix</span>       - Enter the matrix.`;
        },
        ls: (args) => {
            let path = args[0] || '.';
            // If path is '.', use the current working directory directly.
            // Otherwise, resolve the given path.
            const targetDir = (path === '.') ? getPathObject(cwd, '/') : getPathObject(path, cwd);

            if (!targetDir || targetDir.type !== 'folder') {
                return `ls: cannot access '${path}': No such file or directory`;
            }
            const children = Object.keys(targetDir.children);
            if (children.length === 0) return '';

            return children.map(name => {
                const color = targetDir.children[name].type === 'folder' ? 'var(--accent-color)' : 'var(--primary-color)';
                return `<span style="color: ${color};">${name}</span>`;
            }).join('\n');
        },
        cd: (args) => {
            const targetPath = args[0] || '/';
            const targetDir = getPathObject(targetPath, cwd);
            if (!targetDir || targetDir.type !== 'folder') {
                return `cd: no such file or directory: ${targetPath}`;
            }
            // Normalize the new path
            let newCwd = (cwd === '/' ? '' : cwd) + '/' + targetPath;
            if (targetPath.startsWith('/')) newCwd = targetPath;
            // Basic '..' handling
            newCwd = newCwd.replace(/\/[^/]+\/\.\./g, '') || '/';
            cwd = newCwd;
            // Update the prompt visually (optional but cool)
            windowElement.querySelector('.flex-shrink-0 > span').textContent = `devdebug@os:~${cwd}$`;
            return '';
        },
        cat: (args) => {
            const filePath = args[0];
            if (!filePath) return "Usage: cat [file_path]";
            const fileObject = getPathObject(filePath, cwd);
            if (!fileObject || fileObject.type !== 'file') return `cat: ${filePath}: No such file or directory`;
            return fileObject.content;
        },
        ps: () => {
            let output = '<span style="color: var(--text-color-dim);">PROCESS\t\t\t\t\t\tCPU\t\tMEM</span>\n';
            output += '----------------------------------------------\n';
            const openApps = Object.keys(WindowManager.openWindows);
            if (openApps.length === 0) {
                return "No active processes.";
            }
            openApps.forEach(appId => {
                const cpu = (Math.random() * (appId === 'snake' || appId === 'terminal-tennis' ? 15 : 5)).toFixed(2).padStart(6, ' ');
                const mem = (Math.random() * 100 + 50).toFixed(1).padStart(6, ' ');
                output += `${appId.padEnd(24, ' ')}${cpu}%\t${mem}MB\n`;
            });
            return output;
        },
        open: (args) => {
            const appId = args[0];
            if (!appId) return "Usage: open [app_id]";
            if (apps[appId]) {
                openApp(appId);
                return `Executing: ${appId}...`;
            }
            return `Error: Application '${appId}' not found.`;
        },
        kill: (args) => {
            const appId = args[0];
            if (!appId) return "Usage: kill [app_id]";
            if (appId === 'terminal') return "Error: Cannot terminate the terminal from within itself.";
            if (WindowManager.openWindows[appId]) {
                closeApp(appId);
                return `Process '${appId}' terminated.`;
            }
            return `Error: Process '${appId}' not found or not running.`;
        },
        clear: () => {
            outputEl.innerHTML = '';
            return ''; // No output
        },
        echo: (args) => {
            const message = args.join(' ') || "...";
            const botArt =
                `   \\  
  \\  
    |\\__/,|   (\`\\
    |_ _  |.--.) )
    ( T   )     /
  (((^_(((/(((_/                
                   `;
            return `<span style="color: var(--accent-color);"> &lt; ${message} &gt;</span>\n` + botArt;
        },
        date: () => {
            return new Date().toLocaleString();
        },
        neofetch: () => {
            return `
<span style="color: var(--text-color-dim);">devdebug@os</span>
-------------------
<span style="color: var(--text-color-dim);">OS:</span> DEVDEBUG OS v1.0
<span style="color: var(--text-color-dim);">Kernel:</span> 5.4.0-generic-js
<span style="color: var(--text-color-dim);">Uptime:</span> ${new Date(new Date() - window.osStartTime).toISOString().substr(11, 8)}
<span style="color: var(--text-color-dim);">Shell:</span> term.js
<span style="color: var(--text-color-dim);">Resolution:</span> ${window.innerWidth}x${window.innerHeight}
<span style="color: var(--text-color-dim);">Theme:</span> [Current]
<span style="color: var(--text-color-dim);">CPU:</span> Ryzen 5 (Simulated)
<span style="color: var(--text-color-dim);">GPU:</span> NVIDIA RTX 5060 Ti (Sim)`;
        },
        devdebug: () => {
            const logo = `

                  
██████╗ ███████╗██╗   ██╗██████╗ ███████╗██████╗ ██╗   ██╗ ██████╗  
██╔══██╗██╔════╝██║   ██║██╔══██╗██╔════╝██╔══██╗██║   ██║██╔════╝  
██║  ██║█████╗  ██║   ██║██║  ██║█████╗  ██████╔╝██║   ██║██║  ███╗ 
██║  ██║██╔══╝  ╚██╗ ██╔╝██║  ██║██╔══╝  ██╔══██╗██║   ██║██║   ██║ 
██████╔╝███████╗ ╚████╔╝ ██████╔╝███████╗██████╔╝╚██████╔╝╚██████╔╝ 
╚═════╝ ╚══════╝  ╚═══╝  ╚═════╝ ╚══════╝╚═════╝  ╚═════╝  ╚═════╝  
------------------------------------ Made with ♥ by Debmalya Mondal           
                  
                  `;
            return `<pre style="line-height: 1.2;">${logo}</pre>`;
        },
        matrix: () => {
            // This command is special and is handled by the executeCommand function
            // It returns a string that will be briefly visible.
            return 'INITIALIZING MATRIX...';
        }
    };

    const executeCommand = (commandStr) => {
        printToTerminal(commandStr, true);
        commandHistory.unshift(commandStr);
        historyIndex = -1;

        const parts = commandStr.trim().split(/\s+/);
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        if (command === 'matrix') {
            startMatrixAnimation(args);
            return; // Prevent further processing
        }

        if (commands[command]) {
            const result = commands[command](args);
            if (result) printToTerminal(result);
        } else if (command) {
            printToTerminal(`Command not found: ${command}. Type 'help' for a list of commands.`);
        }
    };

    const startMatrixAnimation = (args) => {
        const inputContainer = windowElement.querySelector('.flex-shrink-0');
        inputContainer.style.display = 'none'; // Hide the input prompt

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size to fill the container
        canvas.width = outputEl.clientWidth;
        canvas.height = outputEl.clientHeight;

        // Animation properties
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
        const bgColor = 'rgba(0, 0, 0, 0.05)';
        const fontSize = 16;
        const columns = canvas.width / fontSize;

        const charSets = {
            mixed: 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホমোয়ো্যোয়ো গোজো দোবো পো পো ভুতুন 0123456789', // Simplified Katakana + numbers
            english: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()',
            bengali: 'অআইঈউঊঋঌএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহংঃঽািীুূৃৄেৈোৌ্ৎ',
        };

        let chars;
        const mode = args[0] ? args[0].toLowerCase() : 'mixed';

        if (mode === 'e' || mode === 'english') {
            chars = charSets.english;
        } else if (mode === 'b' || mode === 'bengali') {
            chars = charSets.bengali;
        } else {
            chars = charSets.mixed;
        }

        const drops = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        let animationFrameId;

        function draw() {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = primaryColor;
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            animationFrameId = requestAnimationFrame(draw);
        }

        const stopMatrixAnimation = () => {
            cancelAnimationFrame(animationFrameId);
            canvas.remove();
            inputContainer.style.display = 'flex'; // Show the input prompt again
            printToTerminal("Matrix sequence terminated.");
            inputEl.focus();
            // Remove listeners to prevent memory leaks
            document.removeEventListener('keydown', stopMatrixAnimation);
            windowElement.removeEventListener('click', stopMatrixAnimation);
        };

        // Add listeners to stop the animation
        document.addEventListener('keydown', stopMatrixAnimation, { once: true });
        windowElement.addEventListener('click', stopMatrixAnimation, { once: true });

        printToTerminal("Entering the Matrix... Press any key or click to exit.");
        setTimeout(() => {
            outputEl.innerHTML = ''; // Clear message
            outputEl.appendChild(canvas);
            draw();
        }, 1000);
    };

    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            executeCommand(inputEl.value);
            inputEl.value = '';
        } else if (e.key === 'ArrowUp') {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                inputEl.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            if (historyIndex > 0) {
                historyIndex--;
                inputEl.value = commandHistory[historyIndex];
            } else {
                historyIndex = -1;
                inputEl.value = '';
            }
        }
    });

    // Focus the input when the window is clicked
    windowElement.addEventListener('click', () => inputEl.focus());

    inputEl.focus();

    printToTerminal("DEVDEBUG OS [Isolated Environment]\n(c) DevDebug Corporation. All rights reserved.\n\nType 'help' for a list of available commands.");
}
