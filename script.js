/**
 * Portfolio Interactivity & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Terminal Typing Effect ---
    const terminalBody = document.getElementById('terminal-body');
    
    const terminalCommands = [
        { cmd: 'whoami', output: 'valerio_simeraro' },
        { cmd: 'cat /etc/skills', output: 'linux, docker, k8s, ansible, automation, networking' },
        { cmd: 'systemctl status engineer', output: '● engineer.service - Senior DevOps & SysAdmin\n   Loaded: loaded\n   Active: active (running)\n   Status: "Ready for new challenges."' },
        { cmd: './deploy_future.sh', output: 'Initiating deployment sequences... [OK]\nRouting traffic... [OK]\nWelcome to my portfolio.' }
    ];

    let currentCmdIndex = 0;
    
    async function typeTerminal() {
        if(currentCmdIndex >= terminalCommands.length) {
            // Add blinking cursor at the end
            const cursorLine = document.createElement('div');
            cursorLine.innerHTML = `<span class="terminal-prompt">root@vsimeraro:~#</span> <span class="terminal-cursor"></span>`;
            terminalBody.appendChild(cursorLine);
            return;
        }

        const data = terminalCommands[currentCmdIndex];
        const cmdLine = document.createElement('div');
        cmdLine.className = 'terminal-line';
        
        const promptParams = `<span class="terminal-prompt">root@vsimeraro:~#</span> `;
        cmdLine.innerHTML = promptParams;
        
        const commandSpan = document.createElement('span');
        commandSpan.className = 'terminal-command';
        cmdLine.appendChild(commandSpan);
        
        const cursor = document.createElement('span');
        cursor.className = 'terminal-cursor';
        cmdLine.appendChild(cursor);
        
        terminalBody.appendChild(cmdLine);

        // Type command
        for(let i=0; i < data.cmd.length; i++) {
            commandSpan.textContent += data.cmd.charAt(i);
            await new Promise(r => setTimeout(r, 50 + Math.random() * 50));
        }

        // Wait before showing output
        await new Promise(r => setTimeout(r, 300));
        
        // Remove cursor from command line
        cursor.remove();

        // Show output
        if(data.output) {
            const outLine = document.createElement('div');
            outLine.className = 'terminal-line terminal-output';
            // handle newlines in output
            outLine.innerHTML = data.output.replace(/\n/g, '<br>');
            terminalBody.appendChild(outLine);
        }

        await new Promise(r => setTimeout(r, 600));
        currentCmdIndex++;
        typeTerminal();
    }

    // Start typing effect after a small initial delay
    setTimeout(typeTerminal, 500);


    // --- 2. Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once visible
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });


    // --- 3. Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 4. Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if(navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // --- 5. Uptime Counter Simulation ---
    const uptimeSpan = document.getElementById('uptime');
    // Set a mock start time (e.g. 5 days ago)
    let uptimeSeconds = 5 * 24 * 60 * 60 + 10 * 60 * 60 + 25 * 60; // 5d 10h 25m
    
    setInterval(() => {
        uptimeSeconds++;
        const d = Math.floor(uptimeSeconds / (3600*24));
        const h = Math.floor(uptimeSeconds % (3600*24) / 3600);
        const m = Math.floor(uptimeSeconds % 3600 / 60);
        const s = Math.floor(uptimeSeconds % 60);
        
        uptimeSpan.textContent = `${d}d ${h}h ${m}m ${s}s`;
    }, 1000);

});
