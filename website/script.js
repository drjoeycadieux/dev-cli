document.addEventListener('DOMContentLoaded', () => {
    const terminal = document.getElementById('terminal');
    const copyBtn = document.querySelector('.copy-btn');
    const copyBox = document.querySelector('.copy-box code');

    // Simple terminal animation
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

    // Copy to clipboard
    copyBtn.addEventListener('click', () => {
        const textToCopy = copyBox.innerText;
        navigator.clipboard.writeText(textToCopy).then(() => {
            copyBtn.innerText = 'Copied!';
            copyBtn.style.background = '#27c93f';
            setTimeout(() => {
                copyBtn.innerText = 'Copy';
                copyBtn.style.background = '#06b6d4';
            }, 2000);
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
