document.addEventListener("DOMContentLoaded", function () {
    const player = document.getElementById("player");
    const enemy = document.getElementById("enemy");
    const bullet = document.getElementById("bullet");

    let playerX = 400;
    let playerY = 300;

    let enemyX = 100;
    let enemyY = 100;

    let bulletX = -10;
    let bulletY = -10;

    document.addEventListener("keydown", function (event) {
        // Move player with arrow keys
        switch (event.key) {
            case "ArrowUp":
                playerY -= 10;
                break;
            case "ArrowDown":
                playerY += 10;
                break;
            case "ArrowLeft":
                playerX -= 10;
                break;
            case "ArrowRight":
                playerX += 10;
                break;
        }
        updatePlayerPosition();
    });

    function updatePlayerPosition() {
        player.style.left = playerX + "px";
        player.style.top = playerY + "px";

        // Update bullet position based on player position
        bulletX = playerX + 8;
        bulletY = playerY + 8;
        bullet.style.left = bulletX + "px";
        bullet.style.top = bulletY + "px";

        // Check for collision with enemy
        checkCollision();
    }

    function checkCollision() {
        const playerRect = player.getBoundingClientRect();
        const enemyRect = enemy.getBoundingClientRect();

        // Simple collision check based on bounding rectangles
        if (
            playerRect.right > enemyRect.left &&
            playerRect.left < enemyRect.right &&
            playerRect.bottom > enemyRect.top &&
            playerRect.top < enemyRect.bottom
        ) {
            alert("Game Over");
        }
    }

    // Enemy shooting mechanism
    function enemyShoot() {
        const angle = Math.atan2(playerY - enemyY, playerX - enemyX);
        bulletX = enemyX + 8 + Math.cos(angle) * 20;
        bulletY = enemyY + 8 + Math.sin(angle) * 20;
        bullet.style.left = bulletX + "px";
        bullet.style.top = bulletY + "px";
    }

    // Game loop
    function gameLoop() {
        enemyShoot();
        updatePlayerPosition();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
