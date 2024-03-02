const player = document.getElementById('player');
const bullet = document.getElementById('bullet');
const gameContainer = document.getElementById('game-container');
const enemies = document.querySelectorAll('.enemy');

let isShooting = false;

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && player.offsetTop > 0) {
        player.style.top = `${player.offsetTop - 10}px`;
    } else if (event.key === 'ArrowDown' && player.offsetTop < gameContainer.clientHeight - player.clientHeight) {
        player.style.top = `${player.offsetTop + 10}px`;
    } else if (event.key === 'ArrowLeft' && player.offsetLeft > 0) {
        player.style.left = `${player.offsetLeft - 10}px`;
    } else if (event.key === 'ArrowRight' && player.offsetLeft < gameContainer.clientWidth - player.clientWidth) {
        player.style.left = `${player.offsetLeft + 10}px`;
    } else if (event.key === ' ' && !isShooting) {
        shoot();
    }
});

function shoot() {
    isShooting = true;
    bullet.style.top = `${player.offsetTop + 5}px`;
    bullet.style.left = `${player.offsetLeft + 5}px`;
    bullet.style.display = 'block';

    const bulletInterval = setInterval(() => {
        bullet.style.left = `${bullet.offsetLeft + 10}px`;

        // Check for collision with enemies
        enemies.forEach((enemy) => {
            if (checkCollision(bullet, enemy)) {
                enemy.style.display = 'none';
            }
        });

        // Check if the bullet is out of the game container
        if (bullet.offsetLeft > gameContainer.clientWidth) {
            clearInterval(bulletInterval);
            bullet.style.display = 'none';
            isShooting = false;
        }
    }, 20);
}

function checkCollision(element1, element2) {
    return (
        element1.offsetTop < element2.offsetTop + element2.clientHeight &&
        element1.offsetTop + element1.clientHeight > element2.offsetTop &&
        element1.offsetLeft < element2.offsetLeft + element2.clientWidth &&
        element1.offsetLeft + element1.clientWidth > element2.offsetLeft
    );
}
