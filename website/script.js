document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tools = Array.isArray(window.DEV_CLI_TOOLS) ? window.DEV_CLI_TOOLS : [];

    /* ------------------------------------------------------------------ */
    /* Footer year                                                         */
    /* ------------------------------------------------------------------ */
    document.querySelectorAll('.footer-year').forEach(el => {
        el.textContent = new Date().getFullYear();
    });

    /* ------------------------------------------------------------------ */
    /* Mobile menu                                                         */
    /* ------------------------------------------------------------------ */
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        const setMenu = open => {
            menuBtn.classList.toggle('active', open);
            navLinks.classList.toggle('active', open);
            menuBtn.setAttribute('aria-expanded', String(open));
        };

        menuBtn.addEventListener('click', () => {
            setMenu(!navLinks.classList.contains('active'));
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => setMenu(false));
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                setMenu(false);
                menuBtn.focus();
            }
        });

        document.addEventListener('click', e => {
            if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
                setMenu(false);
            }
        });
    }

    /* ------------------------------------------------------------------ */
    /* Hero terminal animation (index only)                                */
    /* ------------------------------------------------------------------ */
    const terminal = document.getElementById('terminal');
    if (terminal) {
        const lines = [
            { html: '<span class="prompt">PS C:\\></span> <span class="command">dev-cli install nodejs</span>' },
            { html: '🚀 Preparing to install nodejs...', cls: 'status' },
            { html: '⠁ Installing NodeJS via winget... [█████████████▒▒▒] 85%', cls: 'progress' },
            { html: '✔ Successfully installed nodejs!', cls: 'success' },
            { html: '<span class="prompt">PS C:\\></span> <span class="cursor">|</span>' }
        ];

        const paint = (line, cls) => {
            const div = document.createElement('div');
            div.className = cls ? `line ${cls}` : 'line';
            div.innerHTML = line;
            terminal.appendChild(div);
        };

        if (prefersReducedMotion) {
            terminal.innerHTML = '';
            lines.forEach(l => paint(l.html, l.cls));
        } else {
            let currentLine = 0;
            terminal.innerHTML = '';
            const typeLine = () => {
                if (currentLine >= lines.length) return;
                const line = lines[currentLine++];
                paint(line.html, line.cls);
                setTimeout(typeLine, 800);
            };
            typeLine();
        }
    }

    /* ------------------------------------------------------------------ */
    /* Copy buttons (works on every page, including generated cards)       */
    /* ------------------------------------------------------------------ */
    const copyText = async text => {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return;
        }
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand('copy');
        textarea.remove();
        if (!ok) throw new Error('Copy failed');
    };

    document.addEventListener('click', async e => {
        const btn = e.target.closest('.copy-btn, .copy-mini, [data-copy]');
        if (!btn) return;

        let text = btn.dataset.copy;
        if (!text) {
            const target = btn.parentElement.querySelector('code, pre');
            text = target ? target.innerText : (btn.previousElementSibling && btn.previousElementSibling.innerText);
        }
        if (!text) return;

        const original = btn.textContent;
        const isUpper = original.trim() === original.trim().toUpperCase() && /copy/i.test(original);

        try {
            await copyText(text.trim());
            btn.textContent = isUpper ? 'COPIED!' : 'Copied!';
            btn.classList.add('copied');
        } catch {
            btn.textContent = 'Press Ctrl+C';
        }

        setTimeout(() => {
            btn.textContent = original;
            btn.classList.remove('copied');
        }, 2000);
    });

    /* ------------------------------------------------------------------ */
    /* Smooth scrolling for in-page anchors                                */
    /* ------------------------------------------------------------------ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
            if (this.closest('.docs-sidebar')) {
                history.replaceState(null, '', targetId);
            }
        });
    });

    /* ------------------------------------------------------------------ */
    /* Docs sidebar scroll spy                                             */
    /* ------------------------------------------------------------------ */
    const docsSidebar = document.querySelector('.docs-sidebar');
    if (docsSidebar) {
        const links = Array.from(docsSidebar.querySelectorAll('a[href^="#"]'));
        const sections = links
            .map(link => document.querySelector(link.getAttribute('href')))
            .filter(Boolean);

        if ('IntersectionObserver' in window && sections.length) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    links.forEach(link => {
                        const isActive = link.getAttribute('href') === `#${entry.target.id}`;
                        link.classList.toggle('active', isActive);
                        if (isActive) link.setAttribute('aria-current', 'true');
                        else link.removeAttribute('aria-current');
                    });
                });
            }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });

            sections.forEach(section => observer.observe(section));
        }
    }

    /* ------------------------------------------------------------------ */
    /* Tools page: search, category filter, rendering                      */
    /* ------------------------------------------------------------------ */
    const toolsGrid = document.getElementById('tools-grid');
    if (toolsGrid && tools.length) {
        const searchInput = document.getElementById('tool-search');
        const chipsContainer = document.getElementById('category-chips');
        const countEl = document.getElementById('tool-count');
        const emptyEl = document.getElementById('tools-empty');
        const clearBtn = document.getElementById('clear-filters');

        const categories = ['All', ...new Set(tools.map(t => t.category))];
        const state = { query: '', category: 'All' };

        const escapeHtml = value => String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

        const categoryIcons = {
            Languages: '🔤',
            'Version Control': '🔀',
            Editors: '📝',
            'Build Tools': '🔨',
            Containers: '📦',
            Databases: '🗄️',
            Cloud: '☁️'
        };

        chipsContainer.innerHTML = categories.map(category => `
            <button type="button" class="chip${category === 'All' ? ' chip-active' : ''}"
                    data-category="${escapeHtml(category)}" aria-pressed="${category === 'All'}">
                ${category}
            </button>
        `).join('');

        const render = () => {
            const query = state.query.trim().toLowerCase();
            const filtered = tools.filter(tool => {
                const matchesCategory = state.category === 'All' || tool.category === state.category;
                const haystack = `${tool.name} ${tool.id} ${tool.description} ${tool.category}`.toLowerCase();
                return matchesCategory && (!query || haystack.includes(query));
            });

            toolsGrid.innerHTML = filtered.map(tool => `
                <article class="tool-card">
                    <div class="tool-card-top">
                        <h2>${escapeHtml(tool.name)}</h2>
                        <span class="tool-tag">${categoryIcons[tool.category] || '🛠️'} ${escapeHtml(tool.category)}</span>
                    </div>
                    <span class="id">${escapeHtml(tool.id)}</span>
                    <p>${escapeHtml(tool.description)}</p>
                    <div class="install-cmd">
                        <code>dev-cli install ${escapeHtml(tool.name)}</code>
                        <button type="button" class="copy-mini" data-copy="dev-cli install ${escapeHtml(tool.name)}"
                                aria-label="Copy install command for ${escapeHtml(tool.name)}">COPY</button>
                    </div>
                </article>
            `).join('');

            emptyEl.hidden = filtered.length !== 0;

            if (countEl) {
                const label = filtered.length === 1 ? 'tool' : 'tools';
                countEl.textContent = query || state.category !== 'All'
                    ? `Showing ${filtered.length} of ${tools.length} ${label}`
                    : `${tools.length} curated tools available`;
            }
        };

        chipsContainer.addEventListener('click', e => {
            const chip = e.target.closest('.chip');
            if (!chip) return;

            state.category = chip.dataset.category;
            chipsContainer.querySelectorAll('.chip').forEach(c => {
                const active = c === chip;
                c.classList.toggle('chip-active', active);
                c.setAttribute('aria-pressed', String(active));
            });
            render();
        });

        searchInput.addEventListener('input', () => {
            state.query = searchInput.value;
            render();
        });

        searchInput.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                state.query = '';
                render();
                searchInput.blur();
            }
        });

        document.addEventListener('keydown', e => {
            const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
            if (e.key === '/' && !typing) {
                e.preventDefault();
                searchInput.focus();
            }
        });

        clearBtn.addEventListener('click', () => {
            state.query = '';
            state.category = 'All';
            searchInput.value = '';
            chipsContainer.querySelectorAll('.chip').forEach(c => {
                const active = c.dataset.category === 'All';
                c.classList.toggle('chip-active', active);
                c.setAttribute('aria-pressed', String(active));
            });
            render();
            searchInput.focus();
        });

        render();
    }

    /* ------------------------------------------------------------------ */
    /* Interactive CLI demo (index only)                                   */
    /* ------------------------------------------------------------------ */
    const demoTerminal = document.getElementById('demo-terminal');
    const demoForm = document.getElementById('demo-form');
    const demoInput = document.getElementById('demo-input');
    const demoSuggestions = document.getElementById('demo-suggestions');

    if (demoTerminal && demoForm && demoInput) {
        const history = [];
        let historyIndex = 0;
        let busy = false;

        const prompt = '<span class="prompt">PS C:\\></span>';
        const print = (html, cls = '') => {
            const line = document.createElement('div');
            line.className = cls ? `line ${cls}` : 'line';
            line.innerHTML = html;
            demoTerminal.appendChild(line);
            demoTerminal.scrollTop = demoTerminal.scrollHeight;
        };
        const printCommand = raw => print(`${prompt} <span class="command">${escapeHtml(raw)}</span>`);

        const escapeHtml = value => String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

        const delay = ms => new Promise(resolve => setTimeout(resolve, prefersReducedMotion ? 0 : ms));

        const findTool = name => {
            const needle = name.toLowerCase();
            return tools.find(t => t.name.toLowerCase() === needle || t.id.toLowerCase() === needle);
        };

        const printHelp = () => {
            print('<strong>Available commands</strong>', 'status');
            print('  dev-cli list             → list every curated tool');
            print('  dev-cli install &lt;tool&gt;  → install a tool (simulated)');
            print('  dev-cli check            → check which tools are installed');
            print('  dev-cli --version        → show the CLI version');
            print('  clear                    → clear the terminal');
            print('  help                     → show this message');
        };

        const runCommand = async raw => {
            const input = raw.trim();
            if (!input) return;

            printCommand(input);

            const parts = input
                .replace(/^dev-cli(\.exe)?\s*/i, '')
                .trim()
                .split(/\s+/);

            const command = parts[0].toLowerCase();
            const arg = parts.slice(1).join(' ').trim();

            switch (command) {
                case 'help':
                case '--help':
                case '-h':
                    printHelp();
                    break;

                case 'list':
                    if (!tools.length) {
                        print('Tool catalog unavailable.', 'status');
                        break;
                    }
                    let currentCategory = '';
                    tools.forEach(tool => {
                        if (tool.category !== currentCategory) {
                            currentCategory = tool.category;
                            print(`📁 ${escapeHtml(currentCategory)}`, 'status');
                        }
                        print(`  <span class="command">${escapeHtml(tool.name)}</span> → ${escapeHtml(tool.description)}`);
                    });
                    print(`✨ Total tools available: ${tools.length}`, 'success');
                    break;

                case 'install':
                case 'i':
                case 'add':
                    if (!arg) {
                        print('Usage: dev-cli install &lt;tool&gt;', 'error');
                        break;
                    }
                    busy = true;
                    demoInput.disabled = true;
                    print(`🚀 Preparing to install ${escapeHtml(arg)}...`, 'status');
                    await delay(350);
                    const tool = findTool(arg);
                    if (!tool) {
                        print(`ℹ Tool '${escapeHtml(arg)}' is not in the curated list.`, 'error');
                        print('  In the real CLI this would try winget directly.', 'progress');
                    } else {
                        print(`⠁ Installing ${escapeHtml(tool.id)} via winget...`, 'progress');
                        await delay(700);
                        print(`✔ Successfully installed ${escapeHtml(tool.name)}!`, 'success');
                    }
                    busy = false;
                    demoInput.disabled = false;
                    demoInput.focus();
                    break;

                case 'check':
                    print('System Tool Check (simulated):', 'status');
                    tools.forEach((tool, index) => {
                        const installed = index % 3 === 0;
                        const label = installed
                            ? '<span class="success-inline">Installed</span>'
                            : '<span class="error-inline">Not Found</span>';
                        print(`  ${escapeHtml(tool.name.padEnd(14, ' '))} : ${label}`);
                    });
                    break;

                case 'version':
                case '--version':
                case '-v':
                case '-V':
                    print('dev-cli 0.1.0');
                    break;

                case 'clear':
                case 'cls':
                    demoTerminal.innerHTML = '';
                    break;

                default:
                    print(`✘ Unknown command: ${escapeHtml(command)}`, 'error');
                    print('Type <span class="command">help</span> to see available commands.', 'progress');
            }
        };

        const submit = async value => {
            if (busy || !value.trim()) return;
            history.push(value);
            historyIndex = history.length;
            demoInput.value = '';
            await runCommand(value);
            demoInput.focus();
        };

        demoForm.addEventListener('submit', e => {
            e.preventDefault();
            submit(demoInput.value);
        });

        demoInput.addEventListener('keydown', e => {
            if (e.key === 'ArrowUp') {
                if (!history.length) return;
                e.preventDefault();
                historyIndex = Math.max(0, historyIndex - 1);
                demoInput.value = history[historyIndex] || '';
            } else if (e.key === 'ArrowDown') {
                if (!history.length) return;
                e.preventDefault();
                historyIndex = Math.min(history.length, historyIndex + 1);
                demoInput.value = history[historyIndex] || '';
            } else if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                demoTerminal.innerHTML = '';
            }
        });

        if (demoSuggestions) {
            demoSuggestions.addEventListener('click', e => {
                const chip = e.target.closest('.chip');
                if (!chip || busy) return;
                submit(chip.dataset.cmd);
            });
        }

        print('Dev-CLI demo <span class="progress">v0.1.0</span> — type <span class="command">help</span> to get started.', 'status');
        print('ℹ This is a simulation. Nothing is installed on your machine.', 'progress');
    }
});
