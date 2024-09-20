const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const TILE_SIZE = 64; // Size of each tile
const FOV = Math.PI / 3; // Field of view
const MAX_DIST = 2000; // Increased maximum draw distance

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const map = [
    '1111111111111111',
    '1000000000000001',
    '1011111101111101',
    '1010000100000101',
    '1010111111100101',
    '1010000000000001',
    '1011111111111111',
];

const player = {
    x: canvas.width / 4, // Starting in the middle of the canvas
    y: canvas.height / 2,
    angle: 0,
    speed: 3,
    turnSpeed: 0.03
};

function drawMap() {
    // Optional: Draw the map for debugging purposes
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === '1') {
                ctx.fillStyle = '#444';
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}

function castRays() {
    const numRays = canvas.width;
    const rayAngle = FOV / numRays;

    for (let i = 0; i < numRays; i++) {
        let angle = player.angle - FOV / 2 + rayAngle * i;
        let x = player.x;
        let y = player.y;
        let stepSize = 1;
        let distance = 0;
        let hit = false;

        while (distance < MAX_DIST) {
            x += Math.cos(angle) * stepSize;
            y += Math.sin(angle) * stepSize;
            distance += stepSize;

            const mapX = Math.floor(x / TILE_SIZE);
            const mapY = Math.floor(y / TILE_SIZE);

            if (mapY >= 0 && mapY < map.length && mapX >= 0 && mapX < map[mapY].length) {
                if (map[mapY][mapX] === '1') {
                    hit = true;
                    break;
                }
            } else {
                break; // Stop if out of bounds
            }
        }

        if (hit) {
            const lineHeight = (TILE_SIZE * canvas.height) / (distance * Math.cos(angle - player.angle));
            const lineOffset = (canvas.height - lineHeight) / 2;

            ctx.fillStyle = '#aaa';
            ctx.fillRect(i, lineOffset, 1, lineHeight);
        } else {
            // Render background color for non-hit rays
            ctx.fillStyle = '#000'; // Black background
            ctx.fillRect(i, 0, 1, canvas.height);
        }
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap(); // Optional: Only use this if you need to debug the map
    castRays();
    requestAnimationFrame(update);
}

function handleKeyDown(event) {
    switch (event.key) {
        case 'w':
            player.x += player.speed * Math.cos(player.angle);
            player.y += player.speed * Math.sin(player.angle);
            break;
        case 's':
            player.x -= player.speed * Math.cos(player.angle);
            player.y -= player.speed * Math.sin(player.angle);
            break;
        case 'a':
            player.angle -= player.turnSpeed;
            break;
        case 'd':
            player.angle += player.turnSpeed;
            break;
    }
}

document.addEventListener('keydown', handleKeyDown);
update();
