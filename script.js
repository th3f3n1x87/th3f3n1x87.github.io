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

    // --- 5. Uptime Counter (reale dalla data di lancio) ---
    const LAUNCH_DATE = new Date('2026-03-16T00:00:00');
    const uptimeSpan = document.getElementById('uptime');
    setInterval(() => {
        const diff = Math.floor((new Date() - LAUNCH_DATE) / 1000);
        const d = Math.floor(diff/86400);
        const h = Math.floor(diff%86400/3600);
        const m = Math.floor(diff%3600/60);
        const s = diff%60;
        uptimeSpan.textContent = `${d}d ${h}h ${m}m ${s}s`;
    }, 1000);

    // --- Copyright year dinamico ---
    const yearEl = document.getElementById('copy-year');
    if(yearEl) yearEl.textContent = new Date().getFullYear();

});

// --- 6. Dynamic PDF Generation via Print ---
function generatePDF() {
    const printContent = `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>Valerio Simeraro - Curriculum Vitae</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 13px;
            color: #222;
            background: #fff;
            padding: 25mm 20mm;
        }
        /* Header */
        .cv-header {
            border-bottom: 3px solid #000;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }
        .cv-header h1 { font-size: 28px; color: #000; }
        .cv-header h2 { font-size: 16px; color: #555; font-weight: normal; margin: 5px 0; }
        .cv-header p  { font-size: 12px; color: #666; margin-top: 8px; }
        /* Section */
        .cv-section {
            margin-bottom: 22px;
            page-break-inside: avoid;
        }
        .cv-section h3 {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
            margin-bottom: 12px;
            color: #000;
        }
        /* Experience item */
        .exp-item {
            margin-bottom: 15px;
            page-break-inside: avoid;
        }
        .exp-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
        }
        .exp-header strong { font-size: 14px; }
        .exp-date { font-size: 12px; color: #666; }
        .exp-company { font-size: 12px; color: #444; font-weight: bold; margin: 3px 0 6px; }
        ul {
            padding-left: 18px;
            line-height: 1.6;
        }
        ul li { margin-bottom: 3px; }
        /* Skills grid */
        .skills-list {
            list-style: none;
            padding: 0;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 5px 20px;
        }
        .skills-list li::before { content: '▸ '; color: #333; }
        /* Certs */
        .cert-list { list-style: none; padding: 0; }
        .cert-list li { margin-bottom: 5px; padding-left: 16px; position: relative; }
        .cert-list li::before { content: '✓'; position: absolute; left: 0; color: #333; }

        @page {
            size: A4;
            margin: 0;
        }
        @media print {
            body { padding: 15mm; }
        }
    </style>
</head>
<body>
    <div class="cv-header">
        <h1>Valerio Simeraro</h1>
        <h2>System Administrator &amp; DevOps Engineer</h2>
        <p>
            Email: valerio.simeraro@example.com &nbsp;|&nbsp;
            LinkedIn: linkedin.com/in/valeriosimeraro &nbsp;|&nbsp;
            GitHub: github.com/th3f3n1x87
        </p>
    </div>

    <div class="cv-section">
        <h3>Profilo</h3>
        <p>Infrastrutture scalabili, automazione spinta e sicurezza come principio base. Ottimizzo sistemi complessi per garantire performance e affidabilità in ambienti mission-critical.</p>
    </div>

    <div class="cv-section">
        <h3>Competenze Tecniche</h3>
        <ul class="skills-list">
            <li><strong>OS & Virtualization:</strong> Linux (Debian, RHEL), Windows Server, VMware, Proxmox</li>
            <li><strong>Containers:</strong> Docker, Kubernetes, Podman</li>
            <li><strong>CI/CD & Automation:</strong> GitLab CI, Ansible, Terraform</li>
            <li><strong>Networking:</strong> Firewall, Routing, VPN, Load Balancing</li>
            <li><strong>Monitoring:</strong> Grafana, Prometheus, ELK Stack</li>
            <li><strong>Cloud:</strong> AWS, Azure (fondamenti)</li>
        </ul>
    </div>

    <div class="cv-section">
        <h3>Esperienza Professionale</h3>

        <div class="exp-item">
            <div class="exp-header">
                <strong>Senior DevOps Engineer</strong>
                <span class="exp-date">2020 – Presente</span>
            </div>
            <div class="exp-company">Azienda IT Placeholder</div>
            <ul>
                <li>Migrazione di infrastrutture legacy verso ambienti cloud-native (Kubernetes/Docker).</li>
                <li>Implementazione di pipeline CI/CD riducendo i tempi di deploy del 40%.</li>
                <li>Gestione e monitoraggio di cluster ad alta affidabilità.</li>
            </ul>
        </div>

        <div class="exp-item">
            <div class="exp-header">
                <strong>System Administrator</strong>
                <span class="exp-date">2016 – 2020</span>
            </div>
            <div class="exp-company">Azienda IT Placeholder</div>
            <ul>
                <li>Amministrazione sistemi Linux/Windows in ambienti enterprise.</li>
                <li>Gestione backup, disaster recovery e ottimizzazione reti aziendali.</li>
                <li>Supporto server e troubleshooting avanzato livello 3.</li>
            </ul>
        </div>

        <div class="exp-item">
            <div class="exp-header">
                <strong>IT Technician &amp; Junior Sysadmin</strong>
                <span class="exp-date">2012 – 2016</span>
            </div>
            <div class="exp-company">Azienda Placeholder</div>
            <ul>
                <li>Assistenza helpdesk livello 2/3.</li>
                <li>Manutenzione hardware e cablaggio reti strutturate.</li>
                <li>Prima configurazione di server e apparati di rete attivi.</li>
            </ul>
        </div>
    </div>

    <div class="cv-section">
        <h3>Certificazioni</h3>
        <ul class="cert-list">
            <li>AWS Certified Solutions Architect – Associate (2023)</li>
            <li>Red Hat Certified Engineer – RHCE (2022)</li>
            <li>CompTIA Security+ (2021)</li>
        </ul>
    </div>

    <script>
        window.onload = function() {
            window.print();
            window.onafterprint = function() { window.close(); };
        }
    <\/script>
</body>
</html>`;

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
}
