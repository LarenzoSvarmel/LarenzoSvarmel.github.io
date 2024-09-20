const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    angle: 0, // Player's rotation
    speed: 3,
    vacuumLength: 40,
    vacuumWidth: 10
};

const keys = {
    w: false,
    a: false,
    s: false,
    d: false
};

const slimes = [];
const slimeCount = 5;

for (let i = 0; i < slimeCount; i++) {
    slimes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 15,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`
    });
}

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    if (event.key === 'w') keys.w = true;
    if (event.key === 'a') keys.a = true;
    if (event.key === 's') keys.s = true;
    if (event.key === 'd') keys.d = true;
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'w') keys.w = false;
    if (event.key === 'a') keys.a = false;
    if (event.key === 's') keys.s = false;
    if (event.key === 'd') keys.d = false;
});

// Mouse tracking for aiming
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    player.angle = Math.atan2(mouseY - player.y, mouseX - player.x);
});

// Game loop
function gameLoop() {
    // Update game state
    movePlayer();

    // Render everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawSlimes();

    requestAnimationFrame(gameLoop);
}

function movePlayer() {
    if (keys.w) player.y -= player.speed;
    if (keys.s) player.y += player.speed;
    if (keys.a) player.x -= player.speed;
    if (keys.d) player.x += player.speed;
}

function drawPlayer() {
    // Draw player circle
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#FF6347'; // Player color (tomato red)
    ctx.fill();
    ctx.closePath();

    // Draw vacuum (rectangle attached to the player)
    const vacuumX = player.x + Math.cos(player.angle) * player.radius;
    const vacuumY = player.y + Math.sin(player.angle) * player.radius;
    ctx.save();
    ctx.translate(vacuumX, vacuumY);
    ctx.rotate(player.angle);
    ctx.fillStyle = '#FFD700'; // Vacuum color (gold)
    ctx.fillRect(0, -player.vacuumWidth / 2, player.vacuumLength, player.vacuumWidth);
    ctx.restore();
}

function drawSlimes() {
    slimes.forEach(slime => {
        ctx.beginPath();
        ctx.arc(slime.x, slime.y, slime.radius, 0, Math.PI * 2);
        ctx.fillStyle = slime.color;
        ctx.fill();
        ctx.closePath();
    });
}

gameLoop();
