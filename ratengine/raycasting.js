const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const map = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1]
];

const TILE_SIZE = 64; // Each block on the map is 64x64 pixels
const FOV = Math.PI / 3; // Field of view (60 degrees)
const NUM_RAYS = canvas.width; // One ray for each column of pixels

let player = {
    x: 160, // Player starting position
    y: 160,
    angle: Math.PI / 2, // Facing upwards
    moveSpeed: 3,
    rotSpeed: 3 * (Math.PI / 180) // Rotation speed in radians (3 degrees per frame)
};

let keys = {}; // For tracking key presses
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

function updatePlayer() {
    let moveX = 0;
    let moveY = 0;
    
    if (keys['w']) { // Move forward
        moveX += Math.cos(player.angle) * player.moveSpeed;
        moveY += Math.sin(player.angle) * player.moveSpeed;
    }
    if (keys['s']) { // Move backward
        moveX -= Math.cos(player.angle) * player.moveSpeed;
        moveY -= Math.sin(player.angle) * player.moveSpeed;
    }
    if (keys['a']) { // Rotate left
        player.angle -= player.rotSpeed;
    }
    if (keys['d']) { // Rotate right
        player.angle += player.rotSpeed;
    }
    
    // Apply movement
    const newX = player.x + moveX;
    const newY = player.y + moveY;
    const mapX = Math.floor(newX / TILE_SIZE);
    const mapY = Math.floor(newY / TILE_SIZE);

    // Collision detection
    if (mapX >= 0 && mapX < map[0].length && mapY >= 0 && mapY < map.length && map[mapY][mapX] === 0) {
        player.x = newX;
        player.y = newY;
    }
}

function castRay(rayAngle) {
    let distanceToWall = 0;
    const stepSize = 0.1; // The increment step per ray
    let hitWall = false;

    let eyeX = Math.cos(rayAngle); // Ray direction (normalized)
    let eyeY = Math.sin(rayAngle);

    while (!hitWall && distanceToWall < 32) {
        distanceToWall += stepSize;

        const testX = Math.floor((player.x + eyeX * distanceToWall) / TILE_SIZE);
        const testY = Math.floor((player.y + eyeY * distanceToWall) / TILE_SIZE);

        // If the ray is outside the map bounds
        if (testX < 0 || testX >= map[0].length || testY < 0 || testY >= map.length) {
            hitWall = true;
            distanceToWall = 32; // Arbitrarily large distance for walls outside the map
        } else if (map[testY][testX] === 1) { // If we hit a wall
            hitWall = true;
        }
    }

    return distanceToWall;
}

function renderScene() {
    // Clear the canvas (black background)
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Iterate through each column of the screen and cast a ray
    for (let i = 0; i < NUM_RAYS; i++) {
        const rayAngle = (player.angle - FOV / 2) + (i / NUM_RAYS) * FOV;
        const distanceToWall = castRay(rayAngle);

        // Calculate the perceived height of the wall (the closer, the taller)
        const wallHeight = (TILE_SIZE * canvas.height) / (distanceToWall || 0.1);
        const lineStart = (canvas.height / 2) - (wallHeight / 2);
        const lineEnd = wallHeight;

        // Shading based on distance (closer walls are brighter)
        const shade = Math.min(255, 255 - distanceToWall * 10);
        ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
        ctx.fillRect(i, lineStart, 1, lineEnd);
    }
}

function gameLoop() {
    updatePlayer();
    renderScene();
    requestAnimationFrame(gameLoop);
}

gameLoop();
