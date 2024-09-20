const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player object
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    angle: 0,
    speed: 3,
    vacuumLength: 40,
    vacuumWidth: 10,
    vacuumPower: 100 // vacuum suction range
};

// Inventory
const inventory = [0, 0, 0, 0, 0]; // 5 inventory slots

// Ranch area
const ranch = {
    x: 100,
    y: 100,
    width: 600,
    height: 400,
    slimes: [] // Slimes currently in the ranch
};

// Handle keyboard and mouse inputs
const keys = { w: false, a: false, s: false, d: false, space: false };
document.addEventListener('keydown', (event) => updateKey(event.key, true));
document.addEventListener('keyup', (event) => updateKey(event.key, false));
canvas.addEventListener('mousemove', trackMouse);

// Slimes array
const slimes = [];
const slimeCount = 5;
for (let i = 0; i < slimeCount; i++) slimes.push(createSlime());

// Create a new slime with random properties
function createSlime() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 15,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        speed: 1 + Math.random(), // Random speed for slimes
        direction: Math.random() * 2 * Math.PI, // Random movement direction
        inRanch: false // Track if the slime is in the ranch
    };
}

// Ranch escape logic
function checkEscape(slime) {
    if (Math.random() < 0.01) { // 1% chance to escape
        slime.inRanch = false;
    }
}

// Vacuum function to suck up slimes
function vacuum() {
    slimes.forEach((slime, index) => {
        const dist = Math.hypot(slime.x - player.x, slime.y - player.y);
        if (dist < player.vacuumPower && dist > player.radius) {
            // Move slime towards player
            const angleToPlayer = Math.atan2(player.y - slime.y, player.x - slime.x);
            slime.x += Math.cos(angleToPlayer) * slime.speed;
            slime.y += Math.sin(angleToPlayer) * slime.speed;
        }
        if (dist <= player.radius + slime.radius && !slime.inRanch) {
            collectSlime(index);
        }
    });
}

// Add slimes to inventory
function collectSlime(index) {
    slimes.splice(index, 1); // Remove the slime from the game
    for (let i = 0; i < inventory.length; i++) {
        if (inventory[i] < 99) {
            inventory[i]++;
            updateInventory();
            return;
        }
    }
}

// Throw slimes into the ranch
function throwSlime() {
    if (inventory[0] > 0 && isInRanch(player.x, player.y)) {
        const thrownSlime = { x: player.x, y: player.y, radius: 15, color: 'red', inRanch: true };
        ranch.slimes.push(thrownSlime);
        inventory[0]--; // Remove one from inventory
        updateInventory();
    }
}

// Check if player is inside the ranch
function isInRanch(x, y) {
    return x > ranch.x && x < ranch.x + ranch.width && y > ranch.y && y < ranch.y + ranch.height;
}

// Update inventory display
function updateInventory() {
    for (let i = 0; i < inventory.length; i++) {
        document.getElementById(`slot${i + 1}`).innerText = inventory[i];
    }
}

// Handle key and mouse events
function updateKey(key, isPressed) {
    if (key === 'w') keys.w = isPressed;
    if (key === 'a') keys.a = isPressed;
    if (key === 's') keys.s = isPressed;
    if (key === 'd') keys.d = isPressed;
    if (key === ' ') keys.space = isPressed; // Space bar for throwing
}
function trackMouse(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    player.angle = Math.atan2(mouseY - player.y, mouseX - player.x);
}

// Move player based on keys pressed
function movePlayer() {
    if (keys.w) player.y -= player.speed;
    if (keys.s) player.y += player.speed;
    if (keys.a) player.x -= player.speed;
    if (keys.d) player.x += player.speed;
}

// Move slimes in random directions
function moveSlimes() {
    slimes.forEach(slime => {
        slime.x += Math.cos(slime.direction) * slime.speed;
        slime.y += Math.sin(slime.direction) * slime.speed;

        // Bounce off walls
        if (slime.x < slime.radius || slime.x > canvas.width - slime.radius) {
            slime.direction = Math.PI - slime.direction; // Reverse direction
        }
        if (slime.y < slime.radius || slime.y > canvas.height - slime.radius) {
            slime.direction = -slime.direction; // Reverse direction
        }

        // Check if slime escapes
        checkEscape(slime);
    });
}

// Draw the ranch
function drawRanch() {
    ctx.fillStyle = '#8B4513'; // Brown color for ranch
    ctx.fillRect(ranch.x, ranch.y, ranch.width, ranch.height);
    ctx.strokeStyle = '#000'; // Border color
    ctx.strokeRect(ranch.x, ranch.y, ranch.width, ranch.height); // Draw border
}

// Draw the player with vacuum
function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#FF6347';
    ctx.fill();
    ctx.closePath();

    // Draw vacuum
    const vacuumX = player.x + Math.cos(player.angle) * player.radius;
    const vacuumY = player.y + Math.sin(player.angle) * player.radius;
    ctx.save();
    ctx.translate(vacuumX, vacuumY);
    ctx.rotate(player.angle);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(0, -player.vacuumWidth / 2, player.vacuumLength, player.vacuumWidth);
    ctx.restore();
}

// Draw slimes
function drawSlimes() {
    slimes.forEach(slime => {
        ctx.beginPath();
        ctx.arc(slime.x, slime.y, slime.radius, 0, Math.PI * 2);
        ctx.fillStyle = slime.color;
        ctx.fill();
        ctx.closePath();
    });

    // Draw slimes in the ranch
    ranch.slimes.forEach(slime => {
        ctx.beginPath();
        ctx.arc(slime.x, slime.y, slime.radius, 0, Math.PI * 2);
        ctx.fillStyle = slime.color;
        ctx.fill();
        ctx.closePath();
    });
}

// Main game loop
function gameLoop() {
    movePlayer();
    moveSlimes(); // Ensure slimes move each frame
    vacuum();
    if (keys.space) throwSlime(); // Check if space is pressed to throw a slime
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRanch(); // Draw the ranch
    drawPlayer();
    drawSlimes();
    requestAnimationFrame(gameLoop);
}

gameLoop();
