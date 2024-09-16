const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
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

const TILE_SIZE = 64;
const FOV = Math.PI / 4; // 45 degrees
const NUM_RAYS = canvas.width / 2; // Number of rays based on canvas width

let player = {
    x: 160,
    y: 160,
    angle: 0,
    moveSpeed: 3,
    rotSpeed: 2 * (Math.PI / 180) // Rotation speed in radians
};

// Event listeners for player movement
let keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

function updatePlayer() {
    if (keys['w']) {
        player.x += Math.cos(player.angle) * player.moveSpeed;
        player.y += Math.sin(player.angle) * player.moveSpeed;
    }
    if (keys['s']) {
        player.x -= Math.cos(player.angle) * player.moveSpeed;
        player.y -= Math.sin(player.angle) * player.moveSpeed;
    }
    if (keys['a']) {
        player.angle -= player.rotSpeed;
    }
    if (keys['d']) {
        player.angle += player.rotSpeed;
    }
}

// Function to cast a single ray
function castRay(rayAngle) {
    let distanceToWall = 0;
    const stepSize = 0.1;
    let hitWall = false;
    let hitBoundary = false;
    
    let eyeX = Math.cos(rayAngle);
    let eyeY = Math.sin(rayAngle);

    while (!hitWall && distanceToWall < 32) {
        distanceToWall += stepSize;
        
        const testX = Math.floor(player.x + eyeX * distanceToWall);
        const testY = Math.floor(player.y + eyeY * distanceToWall);

        if (testX < 0 || testX >= map[0].length || testY < 0 || testY >= map.length) {
            hitWall = true;
            distanceToWall = 32;
        } else if (map[testY][testX] === 1) {
            hitWall = true;
        }
    }

    return distanceToWall;
}

// Function to render the scene
function renderScene() {
    // Clear the screen
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < NUM_RAYS; i++) {
        const rayAngle = (player.angle - FOV / 2) + (i / NUM_RAYS) * FOV;
        const distanceToWall = castRay(rayAngle);

        const lineHeight = (TILE_SIZE * canvas.height) / distanceToWall;
        const lineStart = (canvas.height / 2) - (lineHeight / 2);
        const lineEnd = lineHeight;

        const shade = Math.min(255, 255 - distanceToWall * 8);
        ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
        ctx.fillRect(i * 2, lineStart, 2, lineEnd);
    }
}

// Game loop
function gameLoop() {
    updatePlayer();
    renderScene();
    requestAnimationFrame(gameLoop);
}

gameLoop();
