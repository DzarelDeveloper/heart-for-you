lucide.createIcons();

let stage = 'console';
let consoleFinished = false;

const consoleStage = document.getElementById('console-stage');
const revealStage = document.getElementById('reveal-stage');
const typewriterElement = document.getElementById('typewriter');
const extraLines = document.getElementById('extra-lines');
const statusReady = document.getElementById('status-ready');
const decryptContainer = document.getElementById('decrypt-container');
const decryptButton = document.getElementById('decrypt-button');
const reEncryptButton = document.getElementById('re-encrypt-button');
const decryptedContent = document.getElementById('decrypted-content');
const nameDisplay = document.getElementById('name-display');
const app = document.getElementById('app');
const starsContainer = document.getElementById('stars-container');
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
const musicIcon = document.getElementById('music-icon');

let isMusicPlaying = false;

function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicIcon.setAttribute('data-lucide', 'volume-x');
    } else {
        bgMusic.play();
        musicIcon.setAttribute('data-lucide', 'volume-2');
    }
    isMusicPlaying = !isMusicPlaying;
    lucide.createIcons();
}

musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMusic();
});

function createStars() {
    starsContainer.innerHTML = '';
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
        starsContainer.appendChild(star);
    }
}
createStars();

function typewriter(text, element, delay = 30, callback) {
    let index = 0;
    const span = document.createElement('span');
    element.innerHTML = '';
    element.appendChild(span);
    
    function type() {
        if (index < text.length) {
            span.textContent += text[index];
            index++;
            setTimeout(type, delay);
        } else if (callback) {
            callback();
        }
    }
    type();
}

function addConsoleLine(text, delay = 500, colorClass = "text-white/40") {
    return new Promise(resolve => {
        setTimeout(() => {
            const line = document.createElement('div');
            line.className = `text-xs font-mono ${colorClass} opacity-0 transition-opacity duration-500`;
            line.textContent = `> ${text}`;
            extraLines.appendChild(line);
            line.offsetHeight;
            line.classList.remove('opacity-0');
            resolve();
        }, delay);
    });
}

const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');
let points = [];
let animationFrameId;
let currentText = "i love you";
const altTexts = ["always", "forever", "only you", "my everything", "so much", "LABUDA"];
let isChangingText = false;
const fontSize = 14;
let textWidths = {};
let mouse = { x: -1000, y: -1000 };
let start = null;

function measureWidths() {
    ctx.font = `${fontSize}px "Fira Code", monospace`;
    textWidths["i love you"] = ctx.measureText("i love you").width;
    altTexts.forEach(t => {
        textWidths[t] = ctx.measureText(t).width;
    });
}

function initPoints() {
    points = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = Math.min(canvas.width, canvas.height) / 45;

    if (scale === 0) return;

    for (let t = 0; t < Math.PI * 2; t += 0.05) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        points.push({
            baseX: centerX + x * scale,
            baseY: centerY + y * scale,
            x: centerX + x * scale,
            y: centerY + y * scale,
            alpha: 0,
            targetAlpha: 0.8 + Math.random() * 0.2,
            delay: Math.random() * 2000
        });
    }

    for (let s = 0.2; s < 1; s += 0.2) {
        for (let t = 0; t < Math.PI * 2; t += 0.1) {
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            points.push({
                baseX: centerX + x * scale * s,
                baseY: centerY + y * scale * s,
                x: centerX + x * scale * s,
                y: centerY + y * scale * s,
                alpha: 0,
                targetAlpha: 0.4 + Math.random() * 0.4,
                delay: Math.random() * 3000
            });
        }
    }
}

function draw(time) {
    if (!start) start = time;
    const elapsed = time - start;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px "Fira Code", monospace`;
    
    points.forEach(p => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const maxDist = 100;
        
        if (dist < maxDist) {
            const force = (maxDist - dist) / maxDist;
            p.x -= (dx / dist) * force * 20;
            p.y -= (dy / dist) * force * 20;
        }
        
        p.x += (p.baseX - p.x) * 0.05;
        p.y += (p.baseY - p.y) * 0.05;

        if (elapsed > p.delay) {
            p.alpha += (p.targetAlpha - p.alpha) * 0.02;
        }

        ctx.fillStyle = isChangingText ? `rgba(255, 255, 255, ${p.alpha})` : `rgba(255, 77, 109, ${p.alpha})`;
        const currentWidth = textWidths[currentText] || ctx.measureText(currentText).width;
        ctx.fillText(currentText, p.x - currentWidth / 2, p.y);
    });

    animationFrameId = requestAnimationFrame(draw);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    measureWidths();
    initPoints();
}

function initCanvas() {
    resizeCanvas();
    start = null;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(draw);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

nameDisplay.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isChangingText || stage !== 'reveal') return;
    
    isChangingText = true;
    const oldText = currentText;
    currentText = altTexts[Math.floor(Math.random() * altTexts.length)];
    
    setTimeout(() => {
        currentText = oldText;
        isChangingText = false;
    }, 2000);
});

decryptButton.addEventListener('click', (e) => {
    e.stopPropagation();
    setStage('reveal');
});

reEncryptButton.addEventListener('click', (e) => {
    e.stopPropagation();
    setStage('console');
});

app.addEventListener('click', () => {
    if (stage === 'console' && consoleFinished) {
        setStage('reveal');
    }
});

function setStage(newStage) {
    stage = newStage;
    if (stage === 'reveal') {
        if (!isMusicPlaying) {
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                musicToggle.classList.remove('hidden');
            }).catch(e => console.log("Music error:", e));
        }
        consoleStage.style.opacity = '0';
        consoleStage.style.transform = 'scale(1.05)';
        consoleStage.style.transition = 'all 0.5s ease';
        setTimeout(() => {
            consoleStage.classList.add('hidden');
            revealStage.classList.remove('hidden');
            revealStage.offsetHeight;
            revealStage.classList.add('opacity-100');
            setTimeout(() => {
                decryptedContent.classList.remove('opacity-0', 'scale-90');
                decryptedContent.classList.add('opacity-100', 'scale-100');
            }, 100);
            initCanvas();
        }, 500);
    } else {
        revealStage.classList.remove('opacity-100');
        decryptedContent.classList.add('opacity-0', 'scale-90');
        setTimeout(() => {
            revealStage.classList.add('hidden');
            consoleStage.classList.remove('hidden');
            consoleStage.offsetHeight;
            consoleStage.style.opacity = '1';
            consoleStage.style.transform = 'scale(1)';
        }, 500);
    }
}

window.addEventListener('load', () => {
    document.fonts.ready.then(async () => {
        typewriter("Scanning multiverse for unique bio-signatures...", typewriterElement, 30, async () => {
            await addConsoleLine("Searching across Sector 7-G...", 800);
            await addConsoleLine("Analyzing emotional frequency harmonics...", 1000);
            await addConsoleLine("Signature detected: 'TRUE_LOVE' origin.", 1200, "text-pink-soft");
            await addConsoleLine("Synchronizing heartbeat synchronization...", 800);
            setTimeout(() => {
                consoleFinished = true;
                statusReady.classList.remove('hidden');
                decryptContainer.classList.remove('hidden');
                decryptContainer.offsetHeight;
                decryptContainer.classList.remove('opacity-0');
                decryptContainer.classList.add('opacity-100');
                app.classList.add('cursor-pointer');
            }, 500);
        });
    });
});
