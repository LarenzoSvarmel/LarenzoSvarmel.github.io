const player = document.getElementById('player');
const bullet = document.getElementById('bullet');
const gameContainer = document.getElementById('game-container');
const enemies = document.querySelectorAll('.enemy');

let isShooting = false;
let ammoCount = 30;

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && player.offsetTop > 0) {
        player.style.top = `${player.offsetTop - 10}px`;
    } else if (event.key === 'ArrowDown' && player.offsetTop < gameContainer.clientHeight - player.clientHeight) {
        player.style.top = `${player.offsetTop + 10}px`;
    } else if (event.key === 'ArrowLeft' && player.offsetLeft > 0) {
        player.style.left = `${player.offsetLeft - 10}px`;
    } else if (event.key === 'ArrowRight' && player.offsetLeft < gameContainer.clientWidth - player.clientWidth) {
        player.style.left = `${player.offsetLeft + 10}px`;
    } else if (event.key === ' ' && !isShooting && ammoCount > 0) {
        shoot();
    }
});

function shoot() {
    isShooting = true;
    ammoCount--;

    const bulletDirection = getBulletDirection();
    bullet.style.top = `${player.offsetTop + 5}px`;
    bullet.style.left = `${player.offsetLeft + 5}px`;
    bullet.style.transform = `rotate(${bulletDirection}deg)`;
    bullet.style.display = 'block';

    const bulletInterval = setInterval(() => {
        const radians = (bulletDirection * Math.PI) / 180;
        const deltaX = Math.cos(radians) * 10;
        const deltaY = Math.sin(radians) * 10;

        bullet.style.left = `${bullet.offsetLeft + deltaX}px`;
        bullet.style.top = `${bullet.offsetTop - deltaY}px`;

        // Check for collision with enemies
        enemies.forEach((enemy) => {
            if (checkCollision(bullet, enemy)) {
                enemy.style.display = 'none';
            }
        });

        // Check if the bullet is out of the game container
        if (
            bullet.offsetLeft > gameContainer.clientWidth ||
            bullet.offsetTop < 0 ||
            bullet.offsetTop > gameContainer.clientHeight
        ) {
            clearInterval(bulletInterval);
            bullet.style.display = 'none';
            isShooting = false;
        }
    }, 20);
}

function getBulletDirection() {
    if (player.classList.contains('up')) return 0;
    if (player.classList.contains('down')) return 180;
    if (player.classList.contains('left')) return -90;
    if (player.classList.contains('right')) return 90;
    return 0;
}

function checkCollision(element1, element2) {
    return (
        element1.offsetTop < element2.offsetTop + element2.clientHeight &&
        element1.offsetTop + element1.clientHeight > element2.offsetTop &&
        element1.offsetLeft < element2.offsetLeft + element2.clientWidth &&
        element1.offsetLeft + element1.clientWidth > element2.offsetLeft
    );
}
