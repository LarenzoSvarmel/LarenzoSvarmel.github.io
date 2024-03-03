const canvas = document.getElementById('raycastingCanvas');
const ctx = canvas.getContext('2d');

// Add these lines at the beginning of your raycasting.js file

let keys = {}; // Object to store the state of pressed keys

// Add this function to handle keydown and keyup events
function handleKeyDown(event) {
    keys[event.key] = true;
}

function handleKeyUp(event) {
    keys[event.key] = false;
}

// Add event listeners to capture key presses
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Modify your update function to handle player movement based on key presses
function update() {
    // Handle player movement
    if (keys['ArrowUp']) {
        player.x += Math.cos(player.angle) * 5; // Move forward
        player.y += Math.sin(player.angle) * 5;
    }
    if (keys['ArrowDown']) {
        player.x -= Math.cos(player.angle) * 5; // Move backward
        player.y -= Math.sin(player.angle) * 5;
    }

    // Handle player rotation
    if (keys['ArrowLeft']) {
        player.angle -= 0.1; // Rotate left
    }
    if (keys['ArrowRight']) {
        player.angle += 0.1; // Rotate right
    }

    const rays = [];

    // Cast rays from the player's position
    for (let i = 0; i < screenWidth; i++) {
        const rayAngle = player.angle - Math.PI / 6 + (i / screenWidth) * Math.PI / 3;

        const ray = {
            x: player.x,
            y: player.y,
            angle: rayAngle,
        };

        rays.push(castRay(ray));
    }

    // Other update logic can go here if needed
}

const screenWidth = canvas.width;
const screenHeight = canvas.height;
const tileSize = 50; // Adjust this based on your preference
const player = {
    x: screenWidth / 2,
    y: screenHeight / 2,
    angle: Math.PI / 4, // Initial player angle (45 degrees)
};

function update() {
    const rays = [];

    // Cast rays from the player's position
    for (let i = 0; i < screenWidth; i++) {
        const rayAngle = player.angle - Math.PI / 6 + (i / screenWidth) * Math.PI / 3;
        
        const ray = {
            x: player.x,
            y: player.y,
            angle: rayAngle,
        };

        rays.push(castRay(ray));
    }
}
const gameMap = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1]
];

function castRay(ray) {
    let stepSize = 5;
    let currentX = ray.x;
    let currentY = ray.y;

    while (true) {
        currentX += Math.cos(ray.angle) * stepSize;
        currentY += Math.sin(ray.angle) * stepSize;

        // Check if the current position is within the bounds of your game environment
        if (
            currentX < 0 || currentX >= screenWidth ||
            currentY < 0 || currentY >= screenHeight
        ) {
            return {
                distance: Infinity,
                hit: false,
            };
        }

        // Check if the current position is a wall in your game map (placeholder condition)
        const tileX = Math.floor(currentX / tileSize);
        const tileY = Math.floor(currentY / tileSize);

        if (gameMap[tileY] && gameMap[tileY][tileX] === 1) {
            return {
                distance: Math.sqrt((ray.x - currentX) ** 2 + (ray.y - currentY) ** 2),
                hit: true,
            };
        }
    }
}

function drawMap() {
    for (let row = 0; row < gameMap.length; row++) {
        for (let col = 0; col < gameMap[row].length; col++) {
            if (gameMap[row][col] === 1) {
                // Draw a wall (you can choose a specific color or character)
                ctx.fillStyle = "#555";
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            } else {
                // Draw open space (you can choose a specific color or character)
                ctx.fillStyle = "#222";
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, screenWidth, screenHeight);

    // Draw the background (you can customize this based on your preference)
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, screenWidth, screenHeight / 2);
    ctx.fillStyle = "#444";
    ctx.fillRect(0, screenHeight / 2, screenWidth, screenHeight / 2);

    const wallHeight = 300; // Adjust this based on your preference

    // Draw walls based on ray intersections
    for (let i = 0; i < rays.length; i++) {
        const ray = rays[i];

        const correctedDistance = ray.distance * Math.cos(player.angle - ray.angle); // Correct fish-eye distortion

        const wallHeightProjected = (tileSize / correctedDistance) * wallHeight;

        const wallColor = ray.hit ? "#fff" : "#666"; // Wall color (adjust as needed)

        const columnWidth = screenWidth / rays.length;

        // Draw the wall column
        ctx.fillStyle = wallColor;
        ctx.fillRect(i * columnWidth, (screenHeight - wallHeightProjected) / 2, columnWidth, wallHeightProjected);
    }

    // Draw the player position
    ctx.fillStyle = "#f00"; // Player color (adjust as needed)
    ctx.beginPath();
    ctx.arc(player.x, player.y, 5, 0, Math.PI * 2);
    ctx.fill();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
