// Set up canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Player object
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 20,
    height: 20,
    speed: 3,
    color: 'blue',
    vacRange: 50,  // Range for vacuuming slimes
    inventory: []  // Store slimes the player vacuums up
};

// Slime object
class Slime {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.color = 'green';
        this.direction = Math.random() * 2 * Math.PI;
        this.speed = 1;
        this.isVacuumed = false;
    }

    move() {
        if (!this.isVacuumed) {
            // Random movement
            this.x += Math.cos(this.direction) * this.speed;
            this.y += Math.sin(this.direction) * this.speed;

            // Change direction randomly
            if (Math.random() < 0.01) {
                this.direction = Math.random() * 2 * Math.PI;
            }

            // Keep slime in bounds
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.direction += Math.PI; // Reverse direction
            }
        }
    }
}

// Create slimes
const slimes = [];
for (let i = 0; i < 10; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    slimes.push(new Slime(x, y));
}

// Create a pen for slimes
const pen = {
    x: 100,
    y: 100,
    width: 100,
    height: 100,
    color: 'brown'
};

// Controls
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Check distance between player and slime
function distance(player, slime) {
    return Math.sqrt((player.x - slime.x) ** 2 + (player.y - slime.y) ** 2);
}

// Update game objects
function update() {
    // Player movement
    if (keys['ArrowUp']) player.y -= player.speed;
    if (keys['ArrowDown']) player.y += player.speed;
    if (keys['ArrowLeft']) player.x -= player.speed;
    if (keys['ArrowRight']) player.x += player.speed;

    // Keep player in bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;

    // Slime vacuum mechanic
    if (keys[' '] || keys['Spacebar']) {  // Space key to vacuum
        slimes.forEach((slime, index) => {
            if (distance(player, slime) < player.vacRange && !slime.isVacuumed) {
                player.inventory.push(slime);  // Add slime to player's inventory
                slime.isVacuumed = true;  // Mark slime as vacuumed
            }
        });
    }

    // Release slimes in the pen
    if (keys['Enter'] && player.inventory.length > 0) {
        const releasedSlime = player.inventory.pop();  // Remove a slime from inventory
        releasedSlime.x = pen.x + pen.width / 2;  // Move the slime into the pen
        releasedSlime.y = pen.y + pen.height / 2;
        releasedSlime.isVacuumed = false;  // Release it
    }

    // Update slimes
    slimes.forEach(slime => slime.move());
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw slimes
    slimes.forEach(slime => {
        if (!slime.isVacuumed) {
            ctx.fillStyle = slime.color;
            ctx.fillRect(slime.x, slime.y, slime.width, slime.height);
        }
    });

    // Draw the pen
    ctx.fillStyle = pen.color;
    ctx.fillRect(pen.x, pen.y, pen.width, pen.height);

    // Draw inventory count
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Inventory: ${player.inventory.length}`, 10, 30);
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
