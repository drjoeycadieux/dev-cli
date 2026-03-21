document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // --- Terminal Animation (Index only) ---
    const terminal = document.getElementById('terminal');
    if (terminal) {
        const lines = [
            '<span class="prompt">PS C:\\></span> <span class="command">dev-cli install nodejs</span>',
            '<div class="status">🚀 Preparing to install nodejs...</div>',
            '<div class="progress">⠁ Installing NodeJS via winget... [█████████████▒▒▒] 85%</div>',
            '<div class="success">✔ Successfully installed nodejs!</div>',
            '<span class="prompt">PS C:\\></span> <span class="cursor">|</span>'
        ];

        let currentLine = 0;
        terminal.innerHTML = '';

        function typeLine() {
            if (currentLine < lines.length) {
                const div = document.createElement('div');
                div.className = 'line';
                div.innerHTML = lines[currentLine];
                terminal.appendChild(div);
                currentLine++;
                setTimeout(typeLine, 800);
            }
        }
        typeLine();
    }

    // --- Copy to Clipboard (Global) ---
    const copyBtns = document.querySelectorAll('.copy-btn, .copy-mini');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const codeEl = btn.parentElement.querySelector('code, pre');
            const textToCopy = codeEl ? codeEl.innerText : btn.previousElementSibling.innerText;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = btn.innerText;
                btn.innerText = (originalText.toLowerCase() === 'copy') ? 'Copied!' : 'COPIED!';
                if (btn.classList.contains('copy-mini')) btn.style.color = '#27c93f';
                
                setTimeout(() => {
                    btn.innerText = originalText;
                    if (btn.classList.contains('copy-mini')) btn.style.color = 'var(--primary)';
                }, 2000);
            });
        });
    });

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
