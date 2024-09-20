const canvas = document.getElementById('webglCanvas');
const gl = canvas.getContext('webgl');

// Set canvas SIZEEE
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Vertex Shader
const vertexShaderSource = `
    attribute vec4 a_position;
    uniform mat4 u_matrix;
    void main() {
        gl_Position = u_matrix * a_position;
    }
`;

// Fragment Shader
const fragmentShaderSource = `
    precision mediump float;
    void main() {
        float gradient = gl_FragCoord.y / float(gl.drawingBufferHeight);
        vec3 color = mix(vec3(1.0, 1.0, 1.0), vec3(0.5, 0.0, 0.5), gradient);
        gl_FragColor = vec4(color, 1.0);
    }
`;


// Compile shader function
function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader;
    } else {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }
}

// Create shaders
const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

// Create program
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

// Set up the plane
const positions = new Float32Array([
    -5, 0, -5,
     5, 0, -5,
    -5, 0,  5,
     5, 0,  5,
]);


// Set up the floor
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

// Enable position attribute
const positionLocation = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);


// Get uniform location for matrix
const matrixLocation = gl.getUniformLocation(program, 'u_matrix');

// Camera variables
let camera = {
    position: [0, 0, -3],
    rotation: [0, 0],
    speed: 0.05,
};

// Handle mouse movement
let lastMouseX = canvas.width / 2;
let lastMouseY = canvas.height / 2;
canvas.addEventListener('mousemove', (event) => {
    const deltaX = event.clientX - lastMouseX;
    const deltaY = event.clientY - lastMouseY;
    
    camera.rotation[0] += deltaX * 0.005; // Yaw
    camera.rotation[1] += deltaY * 0.005; // Pitch
    
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
});

// Handle keyboard input
const keys = {};
window.addEventListener('keydown', (event) => {
    keys[event.code] = true;
});
window.addEventListener('keyup', (event) => {
    keys[event.code] = false;
});

// Update camera position based on input
function updateCamera() {
    if (keys['KeyW']) {
        camera.position[2] += camera.speed * Math.cos(camera.rotation[0]);
        camera.position[0] -= camera.speed * Math.sin(camera.rotation[0]);
    }
    if (keys['KeyS']) {
        camera.position[2] -= camera.speed * Math.cos(camera.rotation[0]);
        camera.position[0] += camera.speed * Math.sin(camera.rotation[0]);
    }
    if (keys['KeyA']) {
        camera.position[0] -= camera.speed * Math.cos(camera.rotation[0]);
        camera.position[2] -= camera.speed * Math.sin(camera.rotation[0]);
    }
    if (keys['KeyD']) {
        camera.position[0] += camera.speed * Math.cos(camera.rotation[0]);
        camera.position[2] += camera.speed * Math.sin(camera.rotation[0]);
    }
}

// Render loop
function render() {
    // Clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Update camera
    updateCamera();

    // Create the view matrix
    const viewMatrix = mat4.create();
    mat4.rotateY(viewMatrix, viewMatrix, camera.rotation[0]);
    mat4.rotateX(viewMatrix, viewMatrix, camera.rotation[1]);
    mat4.translate(viewMatrix, viewMatrix, camera.position);

    // Use the matrix
    gl.uniformMatrix4fv(matrixLocation, false, viewMatrix);

    // Draw the floor
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(render);
}

requestAnimationFrame(render);
