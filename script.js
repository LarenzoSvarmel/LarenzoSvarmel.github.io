document.addEventListener("DOMContentLoaded", function () {
    // Get the WebGL context
    const canvas = document.getElementById("webgl-canvas");
    const gl = canvas.getContext("webgl");

    if (!gl) {
        console.error("Unable to initialize WebGL. Your browser may not support it.");
        return;
    }

    // Define the vertex shader source code
    const vertexShaderSource = `
        attribute vec4 a_position;
        void main() {
            gl_Position = a_position;
        }
    `;

    // Define the fragment shader source code
    const fragmentShaderSource = `
        precision mediump float;
        void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
    `;

    // Create shader objects
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Create a shader program and link shaders
    const shaderProgram = createProgram(gl, vertexShader, fragmentShader);

    // Get the attribute location and enable it
    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Create a buffer and bind it to ARRAY_BUFFER
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Define the vertices of the triangle
    const vertices = new Float32Array([
        0.0,  1.0,
       -1.0, -1.0,
        1.0, -1.0,
    ]);

    // Upload the vertices data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Set up the position attribute to read from the buffer
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Set the clear color and clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Use the shader program
    gl.useProgram(shaderProgram);

    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    render(gl, shaderProgram);

 // Initial rotation angle
    let rotationAngle = 0;

    // Call a function to render the triangle with rotation
    render(gl, shaderProgram, rotationAngle);

    // Add event listener for arrow key presses
    document.addEventListener('keydown', function (event) {
        handleKeyPress(event, gl, shaderProgram, rotationAngle);
    });

});

function render(gl, shaderProgram) {
    // Set the clear color and clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Use the shader program
    gl.useProgram(shaderProgram);

    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3);
} // Add this closing curly brace

// Function to create and compile a shader
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function handleKeyPress(event, gl, shaderProgram, rotationAngle) {
    // Arrow key codes: Left - 37, Up - 38, Right - 39, Down - 40
    switch (event.keyCode) {
        case 37: // Left arrow
            rotationAngle -= 0.1;
            break;
        case 39: // Right arrow
            rotationAngle += 0.1;
            break;
    }

    // Normalize the rotation angle to keep it within [0, 2π)
    rotationAngle = (rotationAngle + 2 * Math.PI) % (2 * Math.PI);

    // Call the render function with the updated rotation angle
    render(gl, shaderProgram, rotationAngle);
}

// Function to create and link a program
function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program linking error:", gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }

    return program;
}

