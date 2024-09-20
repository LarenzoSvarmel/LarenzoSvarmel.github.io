const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 50,
    height: 50,
    color: "blue",
    speed: 5,
    angle: 0,
    slimes: []
};

const slimes = [];
const collectedSlimes = [];

class Slime {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 30;
        this.color = "pink";
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}

// Spawn random slimes
for (let i = 0; i < 10; i++) {
    let slimeX = Math.random() * canvas.width;
    let slimeY = Math.random() * canvas.height;
    slimes.push(new Slime(slimeX, slimeY));
}

// Player Movement
function movePlayer() {
    if (keys["ArrowUp"] || keys["w"]) player.y -= player.speed;
    if (keys["ArrowDown"] || keys["s"]) player.y += player.speed;
    if (keys["ArrowLeft"] || keys["a"]) player.x -= player.speed;
    if (keys["ArrowRight"] || keys["d"]) player.x += player.speed;
}

// Crosshair Movement
let mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    let dx = mouse.x - player.x;
    let dy = mouse.y - player.y;
    player.angle = Math.atan2(dy, dx);
});

function collectSlime() {
    for (let i = slimes.length - 1; i >= 0; i--) {
        let slime = slimes[i];
        let dist = Math.hypot(player.x - slime.x, player.y - slime.y);

        if (dist < 40) { // Close enough to collect
            collectedSlimes.push(slime);
            slimes.splice(i, 1);
        }
    }
}

function throwSlime() {
    if (collectedSlimes.length > 0) {
        const slime = collectedSlimes.pop();
        slime.x = player.x + Math.cos(player.angle) * 80;
        slime.y = player.y + Math.sin(player.angle) * 80;
        slimes.push(slime);
    }
}

// Key & Mouse Controls
const keys = {};
window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});
window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

window.addEventListener("mousedown", (e) => {
    if (e.button === 0) { // Left click to collect
        collectSlime();
    } else if (e.button === 2) { // Right click to throw
        throwSlime();
    }
});

function drawPlayer() {
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.angle);
    ctx.fillStyle = player.color;
    ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
    ctx.restore();
}

function drawCrosshair() {
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(mouse.x - 10, mouse.y);
    ctx.lineTo(mouse.x + 10, mouse.y);
    ctx.moveTo(mouse.x, mouse.y - 10);
    ctx.lineTo(mouse.x, mouse.y + 10);
    ctx.stroke();
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movePlayer();
    drawPlayer();

    for (let slime of slimes) {
        slime.draw();
    }

    drawCrosshair();
    requestAnimationFrame(update);
}

update();
