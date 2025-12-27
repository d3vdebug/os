/**
 * DevDebug Profile application module for DEVDEBUG OS
 */

export async function initializeDevDebugWindow(windowElement, system) {
    // Set loading message
    windowElement.querySelector('.window-content').innerHTML = `
               <div class="p-4 text-center" style="color: var(--text-color-dim);">Loading content...</div>
           `;

    let contentData;
    try {
        const response = await fetch('/content.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        contentData = await response.json();
    } catch (error) {
        console.error('Failed to load content.json:', error);
        windowElement.querySelector('.window-content').innerHTML = `
                   <div class="p-4 text-center" style="color: var(--danger-color);">Error: Unable to load content. Please check the console for details.</div>
               `;
        return;
    }

    // Generate skills HTML
    const generateSkillsHTML = (skills) => {
        let html = '';
        if (skills.core) {
            html += `
                       <div class="p-4" style="background-color: var(--primary-color-darker); border-left: 3px solid var(--primary-color);">
                           <h4 class="font-bold mb-3" style="color: var(--text-color-dim);">Core Competencies</h4>
                           <ul class="list-disc list-inside space-y-2">
                               ${skills.core.map(skill => `<li>${skill}</li>`).join('')}
                           </ul>
                       </div>
                   `;
        }
        if (skills.tech || skills.creative) {
            html += `
                       <div class="p-4" style="background-color: var(--primary-color-darker); border-left: 3px solid var(--primary-color);">
                           <div class="flex justify-between items-center mb-4">
                               <h4 class="font-bold" style="color: var(--text-color-dim);">Tools & Tech Stacks</h4>
                               <div id="skill-toggle-btns" class="flex text-xs border rounded-md" style="border-color: var(--primary-color-dark);">
                                   ${skills.tech ? `<button class="skill-toggle-btn active px-3 py-1" data-grid="tech-skills-grid">Tech</button>` : ''}
                                   ${skills.creative ? `<button class="skill-toggle-btn ${skills.tech ? '' : 'active'} px-3 py-1" data-grid="creative-skills-grid">Creative</button>` : ''}
                               </div>
                           </div>
                           ${skills.tech ? `
                               <div id="tech-skills-grid" class="skills-grid grid grid-cols-3 sm:grid-cols-4 gap-2 text-center">
                                   ${skills.tech.map(skill => `<div class="skill-item p-3 flex flex-col items-center justify-center aspect-square" style="background-color: #000; border: 1px solid var(--primary-color-dark);"><img src="${skill.logo}" alt="${skill.name}" class="h-10 w-10"><span class="block text-xs mt-1">${skill.name}</span></div>`).join('')}
                               </div>
                           ` : ''}
                           ${skills.creative ? `
                               <div id="creative-skills-grid" class="skills-grid ${skills.tech ? 'hidden' : ''} grid grid-cols-3 sm:grid-cols-4 gap-2 text-center">
                                   ${skills.creative.map(skill => `<div class="skill-item p-3 flex flex-col items-center justify-center aspect-square" style="background-color: #000; border: 1px solid var(--primary-color-dark);"><img src="${skill.logo}" alt="${skill.name}" class="h-10 w-10"><span class="block text-xs mt-1">${skill.name}</span></div>`).join('')}
                               </div>
                           ` : ''}
                       </div>
                   `;
        }
        return html;
    };

    // Generate blog HTML
    const generateBlogHTML = (blogs) => {
        return blogs.map(blog => `
                   <div class="p-4 flex justify-between items-center" style="background-color: var(--primary-color-darker); border: 1px solid var(--primary-color-dark);">
                       <div>
                           <h4 class="font-bold" style="color: var(--text-color-dim);">${blog.title}</h4>
                           <p class="text-xs opacity-70">${blog.description}</p>
                       </div>
                       <button class="blog-link text-xs px-3 py-1" data-url="${blog.url}">View</button>
                   </div>
               `).join('');
    };

    windowElement.querySelector('.window-content').innerHTML = `
               <div class="flex h-full text-sm">
                   <!-- Left Sidebar -->
                   <div class="w-1/3 flex-shrink-0 flex flex-col p-4 space-y-4" style="background-color: var(--primary-color-darker);">
                       <!-- Profile Header -->
                       <div class="text-center">
                           <div class="w-24 h-24 mx-auto mb-3 flex items-center justify-center rounded-full" style="border: 3px solid var(--primary-color); background-color: #000;">
                               <img src="${contentData.logo || 'assets/me.png'}" alt="${contentData.name || 'DevDebug'} Avatar" class="w-24 h-24 rounded-full">
                           </div>
                           <h2 class="text-xl font-bold">${contentData.name || 'DevDebug'}</h2>
                           <p class="text-xs" style="color: var(--text-color-dim);">Cybersecurity / UX Research</p>
                       </div>

                       <!-- Vertical Tab Navigation -->
                       <div id="devdebug-tabs" class="flex-grow flex flex-col space-y-1">
                           <button class="devdebug-tab-btn active" data-tab="about"><i data-lucide="user-round" class="w-4 h-4 mr-2"></i><span>About</span></button>
                           ${contentData.skills ? `<button class="devdebug-tab-btn" data-tab="skills"><i data-lucide="wrench" class="w-4 h-4 mr-2"></i><span>Skills</span></button>` : ''}
                           ${contentData.blog ? `<button class="devdebug-tab-btn" data-tab="blog"><i data-lucide="rss" class="w-4 h-4 mr-2"></i><span>Blog</span></button>` : ''}
                           <button class="devdebug-tab-btn" data-tab="contact"><i data-lucide="mail" class="w-4 h-4 mr-2"></i><span>Contact</span></button>
                       </div>
                   </div>

                   <!-- Right Content Panel -->
                   <div class="w-2/3 flex-grow p-6 overflow-y-auto" style="color: var(--text-color-dim); border-left: 1px solid var(--primary-color-dark);">
                       <div id="devdebug-tab-about" class="devdebug-tab-content space-y-4">
                           <h3 class="font-bold text-xl mb-3" style="color: var(--primary-color);">[ About Me ]</h3>
                           <div class="p-4 space-y-3" style="background-color: var(--primary-color-darker); border-left: 3px solid var(--primary-color);">
                               <p class="leading-relaxed">${contentData.about || 'No about section available.'}</p>
                           </div>
                       </div>
                       ${contentData.skills ? `
                           <div id="devdebug-tab-skills" class="devdebug-tab-content hidden space-y-4" style="opacity: 0;">
                               <h3 class="font-bold text-xl mb-3" style="color: var(--primary-color);">[ Skillset ]</h3>
                               ${generateSkillsHTML(contentData.skills)}
                           </div>
                       ` : ''}
                       ${contentData.blog ? `
                           <div id="devdebug-tab-blog" class="devdebug-tab-content hidden space-y-4" style="opacity: 0;">
                               <h3 class="font-bold text-xl mb-3" style="color: var(--primary-color);">[ Blogs ]</h3>
                               ${generateBlogHTML(contentData.blog)}
                           </div>
                       ` : ''}
                       <div id="devdebug-tab-contact" class="devdebug-tab-content hidden space-y-4" style="opacity: 0;">
                           <h3 class="font-bold text-xl mb-3" style="color: var(--primary-color);">[ Contact Me ]</h3>
                           <div class="p-4" style="background-color: var(--primary-color-darker); border-left: 3px solid var(--primary-color);">
                               <p class="leading-relaxed mb-3">For encrypted communications, use the following channel. Public keys available upon authenticated request.</p>
                               <a href="mailto:${contentData.contact || 'contact@devdebug.in'}" class="font-mono p-2 inline-block" style="color: var(--accent-color); background-color: #000;">${contentData.contact || 'contact@devdebug.in'}</a>
                           </div>
                       </div>
                   </div>
               </div>
           `;


    // Tab switching logic
    const tabs = windowElement.querySelectorAll('.devdebug-tab-btn');
    const contents = windowElement.querySelectorAll('.devdebug-tab-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            contents.forEach(c => {
                c.classList.add('hidden');
                c.style.opacity = '0';
            });
            const activeContent = windowElement.querySelector(`#devdebug-tab-${tab.dataset.tab}`);
            activeContent.classList.remove('hidden');
            setTimeout(() => activeContent.style.opacity = '1', 10); // Trigger transition
        });
    });

    // --- NEW: Skill toggle logic ---
    const skillToggleContainer = windowElement.querySelector('#skill-toggle-btns');
    if (skillToggleContainer) {
        const toggleBtns = skillToggleContainer.querySelectorAll('.skill-toggle-btn');
        const skillGrids = windowElement.querySelectorAll('.skills-grid');
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                toggleBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                skillGrids.forEach(grid => grid.classList.add('hidden'));
                windowElement.querySelector(`#${btn.dataset.grid}`).classList.remove('hidden');
            });
        });
    }

    lucide.createIcons({ nodes: windowElement.querySelectorAll('[data-lucide]') });

    // Blog link logic
    windowElement.querySelectorAll('.blog-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const url = e.target.dataset.url;
            const { openApp, WindowManager, focusWindow, navigateOrSearch } = system;

            if (typeof openApp === 'function') {
                openApp('browser');
                setTimeout(() => {
                    const browserWindow = WindowManager.openWindows['browser'];
                    if (browserWindow) {
                        browserWindow.querySelector('#browser-url').value = url;
                        if (typeof navigateOrSearch === 'function') {
                            navigateOrSearch(browserWindow, url, false);
                        }
                        if (typeof focusWindow === 'function') {
                            focusWindow(browserWindow);
                        }
                    }
                }, 100);
            }
        });
    });

    // Add styling for the new layout
    const style = document.createElement('style');
    style.innerHTML = `
              .devdebug-tab-btn { display: flex; align-items: center; space-x: 3; width: 100%; text-align: left; padding: 0.75rem 1rem; border-radius: 0.25rem; transition: background-color 0.2s, color 0.2s, border-left-color 0.2s; border-left: 3px solid transparent; }
              .devdebug-tab-btn:hover { background-color: rgba(255,255,255,0.05); }
              .devdebug-tab-btn.active { background-color: var(--primary-color-dark); color: var(--primary-color); font-weight: bold; border-left-color: var(--primary-color); }
              .devdebug-tab-content { transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out; }
              .blog-link { background-color: var(--primary-color); color: black; font-weight: bold; transition: opacity 0.2s; }
              .blog-link:hover { opacity: 0.8; }
              .skill-toggle-btn { transition: background-color 0.2s; }
              .skill-toggle-btn.active { background-color: var(--primary-color); color: black; font-weight: bold; }
              .skill-item { border-radius: 0.25rem; transition: transform 0.2s ease-in-out, border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out; }
              .skill-item:hover {
                  transform: scale(1.05);
                  border-color: var(--primary-color);
                  box-shadow: 0 0 10px var(--primary-color-glow);
                  background-color: rgba(0, 255, 65, 0.1);
              }
          `;
    windowElement.appendChild(style);
}
