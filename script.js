// Get the canvas element and set up the rendering context
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Set the canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player position and direction
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    angle: Math.PI / 2, // Starting angle (facing right)
};

// Raycasting variables
const fov = Math.PI / 3; // Field of view
const rayCount = 300;    // Number of rays

// Update function
function update() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw rays
    for (let i = 0; i < rayCount; i++) {
        const rayAngle = player.angle - fov / 2 + (i / rayCount) * fov;

        // Perform raycasting here...

        // For simplicity, let's just draw lines for now
        const lineLength = 100;
        const x2 = player.x + Math.cos(rayAngle) * lineLength;
        const y2 = player.y + Math.sin(rayAngle) * lineLength;

        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }
}

// Animation loop
function animate() {
    update();
    requestAnimationFrame(animate);
}

// Start the animation loop
animate();
//Nothing here
