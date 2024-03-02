const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 21;
let snake = [{ x: 10, y: 10 }];
let direction = 'right';
let food = createFood();

function createFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize)),
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = '#00f';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    // Draw food
    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function update() {
    const head = { ...snake[0] };

    // Update snake direction
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    // Check for collision with food
    if (head.x === food.x && head.y === food.y) {
        snake.unshift(createFood());
    } else {
        // Remove the tail if no collision with food
        snake.pop();
    }

    // Check for collision with walls
    if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
        resetGame();
        return;
    }

    // Check for collision with itself
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        resetGame();
        return;
    }

    // Move the snake
    snake.unshift(head);
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = 'right';
    food = createFood();
}

function gameLoop() {
    update();
    draw();
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            direction = 'up';
            break;
        case 'ArrowDown':
            direction = 'down';
            break;
        case 'ArrowLeft':
            direction = 'left';
            break;
        case 'ArrowRight':
            direction = 'right';
            break;
    }
});

setInterval(gameLoop, 100);
