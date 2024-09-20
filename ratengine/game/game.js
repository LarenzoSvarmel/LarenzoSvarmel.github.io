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
let shaderProgram;
let groundBuffer;

document.addEventListener('keydown', (event) => {
    keys[event.code] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.code] = false;
});

function initShaders() {
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

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
}

function initBuffers() {
    const groundVertices = [
        -10, 0, -10,
         10, 0, -10,
         10, 0, 10,
        -10, 0, 10,
    ];

    groundBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, groundBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(groundVertices), gl.STATIC_DRAW);
}

function drawGround() {
    gl.bindBuffer(gl.ARRAY_BUFFER, groundBuffer);
    const coordinatesLocation = gl.getAttribLocation(shaderProgram, "coordinates");
    gl.vertexAttribPointer(coordinatesLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coordinatesLocation);

    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 0.1, 100);

    const viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, camera.position, [camera.position[0], 0, 0], [0, 1, 0]);

    const modelViewProjection = mat4.create();
    mat4.multiply(modelViewProjection, projectionMatrix, viewMatrix);

    const mvpLocation = gl.getUniformLocation(shaderProgram, "modelViewProjection");
    gl.uniformMatrix4fv(mvpLocation, false, modelViewProjection);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

function update() {
    const speed = 0.1;

    if (keys['KeyW']) camera.position[2] -= speed;
    if (keys['KeyS']) camera.position[2] += speed;
    if (keys['KeyA']) camera.position[0] -= speed;
    if (keys['KeyD']) camera.position[0] += speed;

    // Limit position to prevent going too far away (optional)
    camera.position[0] = Math.max(-20, Math.min(20, camera.position[0]));
    camera.position[2] = Math.max(-20, Math.min(20, camera.position[2]));
}

function gameLoop() {
    drawGround();
    update();
    requestAnimationFrame(gameLoop);
}

function init() {
    gl.clearColor(0.6, 0.8, 1.0, 1.0); // Sky blue
    initShaders();
    initBuffers();
    gameLoop();
}

window.onload = init;
