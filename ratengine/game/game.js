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
// Compile vertex shader
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    // Compile fragment shader
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    // Create shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    return shaderProgram;
}

    // ... shader compilation code

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

function drawGround(shaderProgram) {
    // Bind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, groundBuffer);
    const coordinatesLocation = gl.getAttribLocation(shaderProgram, "coordinates");
    gl.vertexAttribPointer(coordinatesLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coordinatesLocation);

    // Set up model-view-projection matrix
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 0.1, 100);

    const viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, camera.position, [camera.position[0], 0, 0], [0, 1, 0]);

    const modelViewProjection = mat4.create();
    mat4.multiply(modelViewProjection, projectionMatrix, viewMatrix);
    
    const mvpLocation = gl.getUniformLocation(shaderProgram, "modelViewProjection");
    gl.uniformMatrix4fv(mvpLocation, false, modelViewProjection);

    // Draw the ground
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
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
drawGround(shaderProgram);
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
