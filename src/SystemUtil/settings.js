/**
 * Settings application module for DEVDEBUG OS
 */

export function initializeSettingsWindow(windowElement, system) {
    const { openApp } = system;

    windowElement.querySelector('.window-content').innerHTML = `
              <div class="flex h-full text-sm font-sans">
                  <!-- Left Sidebar -->
                  <div class="w-1/4 min-w-[160px] flex-shrink-0 flex flex-col p-3 space-y-1 h-full" style="background-color: var(--primary-color-darker); border-right: 1px solid var(--primary-color-dark);">
                      <div class="px-3 py-4 mb-2">
                          <h2 class="text-lg font-bold tracking-wide" style="color: var(--primary-color);">SETTINGS</h2>
                      </div>
                      
                      <button class="settings-tab-btn active" data-tab="personalization">
                          <i data-lucide="paintbrush" class="w-5 h-5 flex-shrink-0"></i>
                          <span>Personalization</span>
                      </button>
                      <button class="settings-tab-btn" data-tab="sound">
                          <i data-lucide="volume-2" class="w-5 h-5 flex-shrink-0"></i>
                          <span>Sound</span>
                      </button>
                      <button class="settings-tab-btn" data-tab="system">
                          <i data-lucide="hard-drive" class="w-5 h-5 flex-shrink-0"></i>
                          <span>System</span>
                      </button>
                      <button class="settings-tab-btn" data-tab="about">
                          <i data-lucide="info" class="w-5 h-5 flex-shrink-0"></i>
                          <span>About</span>
                      </button>
                  </div>
      
                  <!-- Right Content Panel -->
                  <div class="flex-grow p-8 overflow-y-auto custom-scrollbar relative">
                      
                      <!-- Personalization Tab -->
                      <div id="settings-tab-personalization" class="settings-tab-content space-y-8 animate-fade-in">
                          <header class="border-b pb-4 mb-6" style="border-color: var(--primary-color-dark);">
                              <h3 class="text-2xl font-bold tracking-tight mb-1" style="color: var(--primary-color);">Personalization</h3>
                              <p class="text-xs opacity-60">Customize your terminal environment aesthetics.</p>
                          </header>
      
                          <!-- Themes -->
                          <section class="space-y-4">
                              <div class="flex justify-between items-center">
                                  <h4 class="text-xs font-bold tracking-widest opacity-70 uppercase">Color Theme</h4>
                                  <button id="reset-theme" class="text-xs px-3 py-1.5 border transition-all hover:bg-opacity-10 hover:bg-white" 
                                      style="border-color: var(--primary-color-dark); color: var(--text-color-dim);">
                                      Restore Default
                                  </button>
                              </div>
                              
                              <div id="theme-swatches" class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                  <!-- Injected by JS -->
                              </div>
      
                              <!-- Hue Slider -->
                              <div class="pt-4 px-1">
                                  <div class="flex justify-between text-xs mb-3 opacity-80">
                                      <span>Global Hue Shift</span>
                                      <span id="hue-value-display" class="font-mono">0°</span>
                                  </div>
                                  <input type="range" id="hue-slider" min="0" max="360" 
                                      class="w-full h-1.5 rounded-full appearance-none cursor-pointer focus:outline-none transition-opacity hover:opacity-100 opacity-80" 
                                      style="background: linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);">
                              </div>
                          </section>
      
                          <!-- Backgrounds -->
                          <section class="space-y-4 pt-6 mt-6 border-t" style="border-color: rgba(255,255,255,0.05);">
                              <h4 class="text-xs font-bold tracking-widest opacity-70 uppercase">Wallpaper</h4>
                              
                              <div id="background-options" class="grid grid-cols-4 gap-3">
                                  <button data-bg="none" class="bg-option group relative aspect-square rounded-lg border transition-all overflow-hidden flex flex-col items-center justify-center gap-2 hover:-translate-y-1" title="No Background">
                                      <i data-lucide="monitor-off" class="w-6 h-6 opacity-50 group-hover:opacity-100 transition-opacity"></i>
                                      <span class="text-[10px] uppercase font-bold tracking-wider opacity-70">None</span>
                                  </button>
                                  <button data-bg="solid" class="bg-option group relative aspect-square rounded-lg border transition-all overflow-hidden flex flex-col items-center justify-center gap-2 hover:-translate-y-1" title="Solid Color">
                                      <div class="w-6 h-6 rounded border border-gray-600 shadow-sm" style="background-color: var(--bg-color);"></div>
                                      <span class="text-[10px] uppercase font-bold tracking-wider opacity-70">Solid</span>
                                  </button>
                                  <!-- Image backgrounds -->
                                  <button data-bg="devdebugBG01.jpg" class="bg-option relative aspect-square rounded-lg border transition-all bg-cover bg-center hover:-translate-y-1" style="background-image: url('${import.meta.env.BASE_URL}assets/BG/devdebugBG01.jpg');" title="NOISE">
                                      <div class="absolute inset-x-0 bottom-0 bg-black/70 py-1 text-center">
                                          <span class="text-[10px] uppercase font-bold tracking-wider text-white">NOISE</span>
                                      </div>
                                  </button>
                                  <button data-bg="devdebugBG02.jpg" class="bg-option relative aspect-square rounded-lg border transition-all bg-cover bg-center hover:-translate-y-1" style="background-image: url('${import.meta.env.BASE_URL}assets/BG/devdebugBG02.jpg');" title="DEBUG">
                                      <div class="absolute inset-x-0 bottom-0 bg-black/70 py-1 text-center">
                                          <span class="text-[10px] uppercase font-bold tracking-wider text-white">DEBUG</span>
                                      </div>
                                  </button>
                              </div>
                              
                              <!-- Hidden Color Picker -->
                              <div id="solid-color-container" class="hidden animate-fade-in pt-2">
                                   <div class="flex items-center space-x-3 p-3 rounded-lg border border-dashed bg-white/5" style="border-color: var(--primary-color-dark);">
                                      <input type="color" id="bg-color-picker" class="w-8 h-8 rounded border-none cursor-pointer bg-transparent p-0" value="#000000">
                                      <label for="bg-color-picker" class="text-xs cursor-pointer select-none opacity-80">Select a solid background color...</label>
                                  </div>
                              </div>
                          </section>
                          
                          <!-- Effects -->
                          <section class="space-y-4 pt-6 mt-6 border-t" style="border-color: rgba(255,255,255,0.05);">
                              <h4 class="text-xs font-bold tracking-widest opacity-70 uppercase">Visual FX</h4>
                              <label class="flex items-center justify-between cursor-pointer group p-3 rounded-lg border border-transparent hover:bg-white/5 transition-colors" style="border-color: transparent;">
                                  <div class="flex items-center space-x-3">
                                      <div class="p-1.5 rounded bg-white/10 group-hover:bg-[var(--primary-color)] group-hover:text-black transition-colors">
                                          <i data-lucide="zap" class="w-4 h-4"></i>
                                      </div>
                                      <div class="flex flex-col">
                                          <span class="text-sm font-bold group-hover:text-[var(--primary-color)] transition-colors">CRT Instability</span>
                                          <span class="text-[10px] opacity-50">Enables screen tearing and glitch artifacts</span>
                                      </div>
                                  </div>
                                  <div class="relative inline-flex items-center cursor-pointer">
                                      <input type="checkbox" id="glitch-toggle" class="sr-only peer">
                                      <div class="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--primary-color)]"></div>
                                  </div>
                              </label>
                          </section>
                      </div>
      
                      <!-- Sound Tab -->
                      <div id="settings-tab-sound" class="settings-tab-content hidden space-y-8 animate-fade-in">
                          <header class="border-b pb-4 mb-6" style="border-color: var(--primary-color-dark);">
                              <h3 class="text-2xl font-bold tracking-tight mb-1" style="color: var(--primary-color);">Sound Control</h3>
                              <p class="text-xs opacity-60">Control system audio levels.</p>
                          </header>
                          
                          <div class="space-y-8 p-4 rounded-lg bg-white/5 border" style="border-color: var(--primary-color-dark);">
                              <div class="space-y-4">
                                  <div class="flex justify-between items-center">
                                      <label for="setting-music-volume" class="font-bold flex items-center space-x-2">
                                          <i data-lucide="music" class="w-4 h-4"></i>
                                          <span>Music Volume</span>
                                      </label>
                                      <span id="music-vol-display" class="font-mono text-xs opacity-70">50%</span>
                                  </div>
                                  <input type="range" id="setting-music-volume" min="0" max="1" step="0.01" class="w-full h-1.5 rounded-full appearance-none cursor-pointer" style="background-color: var(--primary-color-dark);">
                              </div>
                              <div class="space-y-4">
                                   <div class="flex justify-between items-center">
                                      <label for="setting-sfx-volume" class="font-bold flex items-center space-x-2">
                                          <i data-lucide="bell" class="w-4 h-4"></i>
                                          <span>System SFX</span>
                                      </label>
                                      <span id="sfx-vol-display" class="font-mono text-xs opacity-70">50%</span>
                                  </div>
                                  <input type="range" id="setting-sfx-volume" min="0" max="1" step="0.01" class="w-full h-1.5 rounded-full appearance-none cursor-pointer" style="background-color: var(--primary-color-dark);">
                              </div>
                          </div>
                      </div>
      
                      <!-- System Tab -->
                      <div id="settings-tab-system" class="settings-tab-content hidden space-y-6 animate-fade-in">
                          <header class="border-b pb-4 mb-6" style="border-color: var(--primary-color-dark);">
                              <h3 class="text-2xl font-bold tracking-tight mb-1" style="color: var(--primary-color);">System</h3>
                              <p class="text-xs opacity-60">Manage system resources and utilities.</p>
                          </header>
                          
                          <div class="grid gap-3">
                              <button data-app="sysmon" class="settings-action-btn w-full text-left p-4 rounded-lg border bg-white/5 hover:bg-white/10 transition-all flex items-center justify-between group" style="border-color: var(--primary-color-dark);">
                                  <div class="flex items-center space-x-4">
                                      <div class="p-2 rounded bg-black border border-gray-800">
                                          <i data-lucide="activity" class="w-6 h-6 text-[var(--primary-color)]"></i>
                                      </div>
                                      <div>
                                          <span class="block font-bold">Process Explorer</span>
                                          <span class="text-xs opacity-60">Monitor active tasks and resources</span>
                                      </div>
                                  </div>
                                  <i data-lucide="arrow-right" class="w-4 h-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-[var(--primary-color)]"></i>
                              </button>
                              
                              <button data-app="system-properties" class="settings-action-btn w-full text-left p-4 rounded-lg border bg-white/5 hover:bg-white/10 transition-all flex items-center justify-between group" style="border-color: var(--primary-color-dark);">
                                  <div class="flex items-center space-x-4">
                                      <div class="p-2 rounded bg-black border border-gray-800">
                                          <i data-lucide="server" class="w-6 h-6 text-[var(--primary-color)]"></i>
                                      </div>
                                      <div>
                                          <span class="block font-bold">System Properties</span>
                                          <span class="text-xs opacity-60">View hardware and OS status</span>
                                      </div>
                                  </div>
                                   <i data-lucide="arrow-right" class="w-4 h-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-[var(--primary-color)]"></i>
                              </button>
                          </div>
                      </div>
      
                      <!-- About Tab -->
                      <div id="settings-tab-about" class="settings-tab-content hidden space-y-6 animate-fade-in">
                           <header class="border-b pb-4 mb-6" style="border-color: var(--primary-color-dark);">
                              <h3 class="text-2xl font-bold tracking-tight mb-1" style="color: var(--primary-color);">About</h3>
                               <p class="text-xs opacity-60">System information and credits.</p>
                          </header>
      
                          <div class="p-6 rounded-lg text-center space-y-4" style="background-color: rgba(0,0,0,0.5); border: 1px solid var(--primary-color-dark);">
                              <i data-lucide="hat-glasses" class="w-16 h-16 mx-auto opacity-80" style="color: var(--primary-color);"></i>
                              <div>
                                  <h4 class="text-xl font-bold text-white">DEVDEBUG OS</h4>
                                  <p class="text-sm opacity-70 font-mono">v1.0.0 (Stable)</p>
                              </div>
                              <p class="text-sm leading-relaxed max-w-md mx-auto opacity-70">
                                  A simulated desktop environment for the modern digital ghost.
                              </p>
                              <div class="pt-4 mt-4 border-t border-gray-800">
                                  <p class="text-xs opacity-50">&copy; 2026 DevDebug Corporation. All rights reserved.</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          `;

    // Inject Styles
    const style = document.createElement('style');
    style.innerHTML = `
              .settings-tab-btn {
                  display: flex;
                  align-items: center;
                  gap: 12px;
                  width: 100%;
                  text-align: left;
                  padding: 10px 16px;
                  border-radius: 6px;
                  transition: all 0.2s ease;
                  color: var(--text-color-dim);
                  font-weight: 500;
              }
              .settings-tab-btn:hover {
                  background-color: rgba(255, 255, 255, 0.05);
                  color: white;
                  padding-left: 20px;
              }
              .settings-tab-btn.active {
                  background-color: var(--primary-color-highlight);
                  color: var(--primary-color);
                  font-weight: bold;
                  border-left: 3px solid var(--primary-color);
              }
              .bg-option {
                  border-color: var(--primary-color-dark);
                  background-color: rgba(0,0,0,0.4);
                  cursor: pointer;
              }
              .bg-option:hover {
                  border-color: var(--primary-color);
                  box-shadow: 0 0 15px var(--primary-color-highlight);
              }
              .bg-option.active {
                  border-color: var(--primary-color);
                  box-shadow: 0 0 10px var(--primary-color-highlight), inset 0 0 20px var(--primary-color-highlight);
              }
              .theme-swatch-btn {
                  height: 60px;
                  width: 100%;
                  border-radius: 8px;
                  border: 2px solid transparent;
                  transition: all 0.2s;
                  position: relative;
                  overflow: hidden;
                  cursor: pointer;
               }
              .theme-swatch-btn:hover {
                  transform: scale(1.05);
                  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
              }
              .theme-swatch-btn.active {
                  border-color: white;
                  transform: scale(0.98);
              }
              .theme-swatch-btn.active::after {
                  content: '✓';
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  color: white;
                  font-weight: bold;
                  font-size: 18px;
                  text-shadow: 0 1px 3px black;
              }
              @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(5px); }
                  to { opacity: 1; transform: translateY(0); }
              }
              .animate-fade-in {
                  animation: fadeIn 0.3s ease-out forwards;
              }
              input[type=range]::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  height: 16px;
                  width: 16px;
                  border-radius: 50%;
                  background: #ffffff;
                  cursor: pointer;
                  box-shadow: 0 0 5px rgba(0,0,0,0.5);
                  margin-top: -5px; 
              }
              input[type=range]::-moz-range-thumb {
                  height: 16px;
                  width: 16px;
                  border-radius: 50%;
                  background: #ffffff;
                  cursor: pointer;
                  box-shadow: 0 0 5px rgba(0,0,0,0.5);
              }
              input[type=range]::-webkit-slider-runnable-track {
                  width: 100%;
                  height: 6px;
                  cursor: pointer;
                  border-radius: 3px;
              }
              /* Custom Scrollbar for Settings Panel */
              .custom-scrollbar::-webkit-scrollbar {
                  width: 6px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                  background: rgba(0,0,0,0.1);
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: var(--primary-color-dark);
                  border-radius: 3px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: var(--primary-color);
              }
          `;
    windowElement.appendChild(style);

    // --- Tab Switching Logic ---
    const tabs = windowElement.querySelectorAll('.settings-tab-btn');
    const contents = windowElement.querySelectorAll('.settings-tab-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            contents.forEach(c => c.classList.add('hidden'));
            windowElement.querySelector(`#settings-tab-${tab.dataset.tab}`).classList.remove('hidden');
        });
    });

    // --- Personalization Logic ---
    const themes = {
        'DevDebug Green': { hue: 135, saturation: 100, lightness: 50, accentHue: 180, dangerHue: 16 },
        'Terminal Amber': { hue: 45, saturation: 100, lightness: 50, accentHue: 33, dangerHue: 0 },
        'Arctic Blue': { hue: 186, saturation: 100, lightness: 50, accentHue: 180, dangerHue: 340 },
        'Cyberpunk Red': { hue: 0, saturation: 100, lightness: 50, accentHue: 300, dangerHue: 120 }
    };

    const applyTheme = (h, s, l, accentH, dangerH) => {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', `hsl(${h}, ${s}%, ${l}%)`);
        root.style.setProperty('--primary-color-dark', `hsl(${h}, ${s}%, ${l - 30}%)`);
        root.style.setProperty('--primary-color-darker', `hsl(${h}, ${s}%, ${l - 40}%)`);
        root.style.setProperty('--text-color-dim', `hsl(${h}, ${s}%, ${l - 10}%)`);
        root.style.setProperty('--bg-color', `hsl(${h}, 30%, 5%)`);
        root.style.setProperty('--primary-color-glow', `hsla(${h}, ${s}%, ${l}%, 0.3)`);
        root.style.setProperty('--primary-color-highlight', `hsla(${h}, ${s}%, ${l}%, 0.2)`);
        root.style.setProperty('--accent-color', `hsl(${accentH}, 100%, 50%)`);
        root.style.setProperty('--danger-color', `hsl(${dangerH}, 100%, 55%)`);
    };

    let themeSwatchesHtml = '';
    for (const themeName in themes) {
        const t = themes[themeName];
        // Improved Swatch Design
        themeSwatchesHtml += `
                  <div class="group flex flex-col gap-2">
                      <button title="${themeName}" data-theme-name="${themeName}" class="theme-swatch-btn shadow-lg" 
                          style="background: linear-gradient(135deg, hsl(${t.hue}, ${t.saturation}%, ${t.lightness}%) 0%, hsl(${t.hue}, ${t.saturation}%, ${t.lightness - 20}%) 100%);">
                      </button>
                      <span class="text-[10px] text-center uppercase tracking-wide opacity-60 group-hover:opacity-100 transition-opacity">${themeName.replace('DevDebug ', '').replace('Terminal ', '')}</span>
                  </div>`;
    }

    windowElement.querySelector('#theme-swatches').innerHTML = themeSwatchesHtml;

    const hueSlider = windowElement.querySelector('#hue-slider');
    const hueDisplay = windowElement.querySelector('#hue-value-display');

    windowElement.querySelector('#theme-swatches').addEventListener('click', (e) => {
        const btn = e.target.closest('.theme-swatch-btn');
        if (btn) {
            // UI Update
            windowElement.querySelectorAll('.theme-swatch-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const themeName = btn.dataset.themeName;
            const t = themes[themeName];
            if (t) {
                applyTheme(t.hue, t.saturation, t.lightness, t.accentHue, t.dangerHue);
                hueSlider.value = t.hue;
                hueDisplay.textContent = t.hue + '°';
            }
        }
    });

    hueSlider.addEventListener('input', (e) => {
        const hue = parseInt(e.target.value);
        hueDisplay.textContent = hue + '°';
        // Auto-deselect presets
        windowElement.querySelectorAll('.theme-swatch-btn').forEach(b => b.classList.remove('active'));
        applyTheme(hue, 100, 50, (hue + 45) % 360, (hue - 120 + 360) % 360);
    });

    windowElement.querySelector('#reset-theme').addEventListener('click', () => {
        const defaultTheme = themes['DevDebug Green'];
        applyTheme(defaultTheme.hue, defaultTheme.saturation, defaultTheme.lightness, defaultTheme.accentHue, defaultTheme.dangerHue);
        hueSlider.value = defaultTheme.hue;
        hueDisplay.textContent = defaultTheme.hue + '°';
        // Reset active state visually on the first swatch matching default
        // (Simplified: clear all active)
        windowElement.querySelectorAll('.theme-swatch-btn').forEach(b => b.classList.remove('active'));
    });

    hueSlider.value = themes['DevDebug Green'].hue;
    hueDisplay.textContent = themes['DevDebug Green'].hue + '°';

    const glitchToggle = windowElement.querySelector('#glitch-toggle');
    glitchToggle.addEventListener('change', (e) => {
        document.body.classList.toggle('glitch-effect', e.target.checked);
    });

    // Background selection
    const updateBgUI = () => {
        const currentBg = localStorage.getItem('desktopBackground') || 'none';
        const colorPickerContainer = windowElement.querySelector('#solid-color-container');

        // Reset actives
        windowElement.querySelectorAll('.bg-option').forEach(btn => btn.classList.remove('active'));

        // Set active class
        const activeBtn = windowElement.querySelector(`.bg-option[data-bg="${currentBg}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        // Show/Hide Color Picker
        if (currentBg === 'solid') {
            colorPickerContainer.classList.remove('hidden');
            const savedColor = localStorage.getItem('desktopBackgroundColor');
            if (savedColor) windowElement.querySelector('#bg-color-picker').value = savedColor;
        } else {
            colorPickerContainer.classList.add('hidden');
        }
    };

    // Initial UI state
    updateBgUI();

    windowElement.querySelector('#background-options').addEventListener('click', (e) => {
        const btn = e.target.closest('.bg-option');
        if (btn) {
            const bg = btn.dataset.bg;
            if (bg === 'solid') {
                document.body.style.backgroundImage = 'none';
                const color = windowElement.querySelector('#bg-color-picker').value;
                document.body.style.backgroundColor = color;
                localStorage.setItem('desktopBackground', 'solid');
                localStorage.setItem('desktopBackgroundColor', color);
            } else if (bg === 'none') {
                document.body.style.backgroundImage = 'none';
                document.body.style.backgroundColor = '';
                localStorage.setItem('desktopBackground', 'none');
            } else {
                document.body.style.backgroundImage = `url('${import.meta.env.BASE_URL}assets/BG/${bg}')`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundRepeat = 'no-repeat';
                document.body.style.backgroundColor = '';
                localStorage.setItem('desktopBackground', bg);
            }
            updateBgUI();
        }
    });

    windowElement.querySelector('#bg-color-picker').addEventListener('input', (e) => {
        if (localStorage.getItem('desktopBackground') === 'solid') {
            document.body.style.backgroundColor = e.target.value;
            localStorage.setItem('desktopBackgroundColor', e.target.value);
        }
    });

    // --- Sound Logic ---
    const musicAudio = document.getElementById('background-music');
    const hoverAudio = document.getElementById('hover-sound');
    const clickAudio = document.getElementById('click-sound');
    const taskbarVolumeSlider = document.getElementById('volume-slider'); // Main system slider interaction
    const musicVolumeSlider = windowElement.querySelector('#setting-music-volume');
    const sfxVolumeSlider = windowElement.querySelector('#setting-sfx-volume');
    const musicDisplay = windowElement.querySelector('#music-vol-display');
    const sfxDisplay = windowElement.querySelector('#sfx-vol-display');

    if (musicAudio) {
        musicVolumeSlider.value = musicAudio.volume;
        musicDisplay.textContent = Math.round(musicAudio.volume * 100) + '%';
    }

    if (hoverAudio) {
        sfxVolumeSlider.value = hoverAudio.volume;
        sfxDisplay.textContent = Math.round(hoverAudio.volume * 100) + '%';
    }

    musicVolumeSlider.addEventListener('input', (e) => {
        const newVolume = parseFloat(e.target.value);
        if (musicAudio) musicAudio.volume = newVolume;
        musicDisplay.textContent = Math.round(newVolume * 100) + '%';

        // Sync with taskbar if needed
        if (taskbarVolumeSlider) {
            taskbarVolumeSlider.value = newVolume;
            taskbarVolumeSlider.dispatchEvent(new Event('input'));
        }
    });

    sfxVolumeSlider.addEventListener('input', (e) => {
        const newVolume = parseFloat(e.target.value);
        if (hoverAudio) hoverAudio.volume = newVolume;
        if (clickAudio) clickAudio.volume = newVolume;
        sfxDisplay.textContent = Math.round(newVolume * 100) + '%';
    });

    // --- System Logic ---
    windowElement.querySelectorAll('.settings-action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (openApp) openApp(btn.dataset.app);
        });
    });

    lucide.createIcons({ nodes: windowElement.querySelectorAll('[data-lucide]') });
}
