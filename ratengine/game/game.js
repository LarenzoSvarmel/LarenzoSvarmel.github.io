const canvas = document.getElementById("gameCanvas");
const gl = canvas.getContext("webgl");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Set up camera and projection
let camera = {
    position: [0, 1.5, 5],
    rotation: [0, 0],
};

let keys = {};

document.addEventListener('keydown', (event) => {
    keys[event.code] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.code] = false;
});

function initShaders() {
    // Vertex and fragment shader source
    const vertexShaderSource = `
        attribute vec3 coordinates;
        uniform mat4 modelViewProjection;
        void main(void) {
            gl_Position = modelViewProjection * vec4(coordinates, 1.0);
        }`;
    
    const fragmentShaderSource = `
        void main(void) {
            gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0); // Grey color
        }`;

    // Compile shaders
    // ... shader compilation code
}

function initBuffers() {
    // Create buffers for the ground and skybox
    const groundVertices = [
        // Ground square vertices
        -10, 0, -10,
         10, 0, -10,
         10, 0, 10,
        -10, 0, 10,
    ];

    // Create a buffer and put the vertices in it
    const groundBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, groundBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(groundVertices), gl.STATIC_DRAW);
}

function drawScene() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Set up projection and model view
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 0.1, 100);

    const viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, camera.position, [camera.position[0], camera.position[1], 0], [0, 1, 0]);

    const modelViewProjection = mat4.create();
    mat4.multiply(modelViewProjection, projectionMatrix, viewMatrix);

    // Draw ground
    // ... draw ground using the created buffers

    // Draw skybox (simple color for now)
    gl.clearColor(0.6, 0.8, 1.0, 1.0); // Sky blue
}

function update() {
    if (keys['KeyW']) camera.position[2] -= 0.1;
    if (keys['KeyS']) camera.position[2] += 0.1;
    if (keys['KeyA']) camera.position[0] -= 0.1;
    if (keys['KeyD']) camera.position[0] += 0.1;

    // Update camera rotation based on mouse movement (add mouse event listener)
}

function gameLoop() {
    update();
    drawScene();
    requestAnimationFrame(gameLoop);
}

function init() {
    initShaders();
    initBuffers();
    gameLoop();
}

window.onload = init;
