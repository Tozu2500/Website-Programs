const cursor = document.querySelector('.cursor');
const colors = [
    "#FF0080",
    "#FF00FF",
    "#8000FF",
    "#0080FF",
    "#00FFFF",
    "#00FF80",
    "#80FF00",
    "#FF8000",
    "#FFFF00",
    "#FF0000",
];

let colorIndex = 0;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorX = mouseX;
let cursorY = mouseY;

document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    createTrail(e.clientX, e.clientY);
});

function createTrail(x, y) {
    const trail = document.createElement("div");
    trail.className = "trail";
    trail.style.left = x + "px";
    trail.style.top = y + "px";
    trail.style.background = colors[colorIndex];
    trail.style.color = colors[colorIndex];

    document.body.appendChild(trail);

    colorIndex = (colorIndex + 1) % colors.length;

    setTimeout(() => {
        trail.remove();
    }, 800);
}

function animateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;

    cursorX += dx * 0.15;
    cursorY += dy * 0.15;

    cursor.style.left = cursorX + "px";
    cursor.style.top = cursorY + "px";

    requestAnimationFrame(animateCursor);
}

animateCursor();

// Demo trail (auto gen)
let autoAngle = 0;
let autoRadius = 100;
let centerX = window.innerWidth / 2;
let centerY = window.innerHeight / 2;

function autoMoveDemo() {
    autoAngle += 0.02;
    autoRadius = 150 + Math.sin(autoAngle * 2) * 50;

    const x = centerX + Math.cos(autoAngle) * autoRadius;
    const y = centerY + Math.sin(autoAngle) * autoRadius;

    mouseX = x;
    mouseY = y;

    createTrail(x, y);

    setTimeout(autoMoveDemo, 30);
}

// Start demo after 2sec of no movement
let demoTimeout = setTimeout(autoMoveDemo, 2000);

document.addEventListener("mousemove", () => {
    clearTimeout(demoTimeout);
    demoTimeout = setTimeout(autoMoveDemo, 3000);
});