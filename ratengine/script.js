const canvas = document.getElementById('webglCanvas');
const gl = canvas.getContext('webgl');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Vertex Shader
const vertexShaderSource = `
    attribute vec4 a_position;
    void main() {
        gl_Position = a_position;
    }
`;

// Fragment Shader
const fragmentShaderSource = `
    precision mediump float;
    void main() {
        // Create a gradient
        float gradient = gl_FragCoord.y / float(gl_Viewport[3]);
        gl_FragColor = vec4(gradient, gradient, 1.0, 1.0); // Gradient from black to blue
    }
`;

// Compile shader
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

// Set up the rectangle (plane)
const positions = new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
     1,  1,
]);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

// Get position attribute location
const positionLocation = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// Clear the canvas
gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

// Draw the plane
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
