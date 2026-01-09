const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const config = {
    particleCount: 50,
    explosionForce: 8,
    gravity: 0.2,
    particleSize: 4,
    fadeSpeed: 0.02,
    shape: 'circle',
    colorMode: 'rainbow'
};

let particles = [];
let explosionCount = 0;
let isMouseDown = false;
let lastTime = performance.now();
let fps = 60;

class Particle {
    constructor(x, y, vx, vy, color, size, shape) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.alpha = 1;
        this.gravity = config.gravity;
        this.fadeSpeed = config.fadeSpeed;
        this.shape = shape;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        this.bounce = 0.7;
        this.friction = 0.99;
    }

    update() {
        // Apply velocity
        this.x += this.vx;
        this.y += this.vy;

        // Apply gravity
        this.vy += this.gravity;

        // Apply friction
        this.vx *= this.friction;
        this.vy *= this.friction;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) {
            this.vx *= -this.bounce;
            this.x = Math.max(0, Math.min(canvas.width, this.x));
        }

        if (this.y > canvas.height) {
            this.vy *= -this.bounce;
            this.y = canvas.height;
            this.vx *= 0.9;  // Extra friction on the ground
        }

        // Fade out effect
        this.alpha -= this.fadeSpeed;

        // Rotation effect
        this.rotation += this.rotationSpeed;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        switch (this.shape) {
            case 'circle':
                this.drawCircle();
                break;
            case 'square':
                this.drawSquare();
                break;
            case 'star':
                this.drawStar();
                break;
            case 'triangle':
                this.drawTriangle();
                break;
        }

        ctx.restore();
    }

    drawCircle() {
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Glowing effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
    }

    drawSquare() {
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);
    }

    drawStar() {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            const x = Math.cos(angle) * this.size;
            const y = Math.sin(angle) * this.size;

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);

            const innerAngle = angle + Math.PI / 5;
            const innerX = Math.cos(innerAngle) * (this.size * 0.5);
            const innerY = Math.sin(innerAngle) * (this.size * 0.5);
            ctx.lineTo(innerX, innerY);
        }
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
    }

    drawTriangle() {
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.lineTo(this.size, this.size);
        ctx.lineTo(-this.size, this.size);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
    }

    isDead() {
        return this.alpha <= 0;
    }
}

function getColor(mode) {
    switch (mode) {
        case 'rainbow':
            return `hsl(${Math.random() * 360}, 100%, 60%)`;
        case 'fire':
            const fireColors = ["#ff6b6b", "#ee5a6f", "#ff9a56", "#ffd93d"];
            return fireColors[Math.floor(Math.random() * fireColors.length)];
        case 'ice':
            const iceColors = ["#4facfe", "#00f2fe", "#a8edea", "#6dd5ed"];
            return iceColors[Math.floor(Math.random() * iceColors.length)];
        case 'electric':
            const electricColors = ["#fa709a", "#fee140", "#a8edea", "#fed6e3"];
            return electricColors[Math.floor(Math.random() * electricColors.length)];
        case 'random':
            return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
        default:
            return `hsl(${Math.random() * 360}, 100%, 60%)`;
    }
}

// Create an explosion on click
function createExplosion(x, y) {
    const count = config.particleCount;
    const force = config.explosionForce;

    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const velocity = force * (0.5 + Math.random() * 0.5);
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        const color = getColor(config.colorMode);
        const size = config.particleSize * (0.5 + Math.random() * 0.5);

        particles.push(new Particle(x, y, vx, vy, color, size, config.shape));
    }

    explosionCount++;
    document.getElementById("explosionCounter").textContent = explosionCount;
}

// Animation loop
function animate() {
    // FPS Calculation
    const currentTime = performance.now();
    const delta = currentTime - lastTime;
    fps = Math.round(1000 / delta);
    lastTime = currentTime;

    // Clear with trail effect
    ctx.fillStyle = "rgba(10, 10, 30, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw the particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();

        if (particles[i].isDead()) {
            particles.splice(i, 1);
        }
    }

    // Update statistics
    document.getElementById("particleCounter").textContent = particles.length;
    document.getElementById("fpsCounter").textContent = fps;

    requestAnimationFrame(animate);
}

// Event listeners
canvas.addEventListener("mousedown", (e) => {
    isMouseDown = true;
    createExplosion(e.clientX, e.clientY);
});

canvas.addEventListener("mouseup", () => {
    isMouseDown = false;
});

canvas.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
        createExplosion(e.clientX, e.clientY);
    }
});

canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    createExplosion(touch.clientX, touch.clientY);
});

canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    createExplosion(touch.clientX, touch.clientY);
});

// Control updates
document.getElementById("particleCount").addEventListener("input", (e) => {
    config.particleCount = parseInt(e.target.value);
    document.getElementById("countValue").textContent = e.target.value;
});

document.getElementById("explosionForce").addEventListener("input", (e) => {
    config.explosionForce = parseFloat(e.target.value);
    document.getElementById("forceValue").textContent = e.target.value;
});

document.getElementById("gravity").addEventListener("input", (e) => {
    config.gravity = parseFloat(e.target.value);
    document.getElementById("gravityValue").textContent = e.target.value;
});

document.getElementById("particleSize").addEventListener("input", (e) => {
    config.particleSize = parseFloat(e.target.value);
    document.getElementById("sizeValue").textContent = e.target.value;
});

document.getElementById("fadeSpeed").addEventListener("input", (e) => {
    config.fadeSpeed = parseFloat(e.target.value);
    document.getElementById("fadeValue").textContent = e.target.value;
});

document.getElementById("particleShape").addEventListener("change", (e) => {
    config.shape = e.target.value;
});

document.getElementById("colorMode").addEventListener("change", (e) => {
    config.colorMode = e.target.value;
});

document.getElementById("clearBtn").addEventListener("click", () => {
    particles = [];
});

document.getElementById("resetBtn").addEventListener("click", () => {
    particles = [];
    explosionCount = 0;
    config.particleCount = 50;
    config.explosionForce = 8;
    config.gravity = 0.2;
    config.particleSize = 4;
    config.fadeSpeed = 0.02;

    document.getElementById("particleCount").value = 50;
    document.getElementById("explosionForce").value = 8;
    document.getElementById("gravity").value = 0.2;
    document.getElementById("particleSize").value = 4;
    document.getElementById("fadeSpeed").value = 0.02;

    document.getElementById("countValue").textContent = "50";
    document.getElementById("forceValue").textContent = "8";
    document.getElementById("gravityValue").textContent = "0.2";
    document.getElementById("sizeValue").textContent = "4";
    document.getElementById("fadeValue").textContent = "0.02";
    document.getElementById("explosionCounter").textContent = "0";
});

document.querySelectorAll(".color-swatch").forEach(swatch => {
    swatch.addEventListener("click", () => {
        const mode = swatch.dataset.mode;
        config.colorMode = mode;
        document.getElementById("colorMode").value = mode;
    });
});

document.getElementById("toggleBtn").addEventListener("click", () => {
    const controls = document.getElementById("controls");
    const btn = document.getElementById("toggleBtn");

    if (controls.classList.contains("hidden")) {
        controls.classList.remove("hidden");
        btn.textContent = "Hide Controls";
    } else {
        controls.classList.add("hidden");
        btn.textContent = "Show Controls";
    }
});

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

animate();