document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("webgl-canvas");
    const gl = canvas.getContext("webgl");

    if (!gl) {
        console.error("Unable to initialize WebGL. Your browser may not support it.");
        return;
    }

    const vertexShaderSource = "attribute vec4 a_position;void main(){gl_Position=a_position;}";
    const fragmentShaderSource = "precision mediump float;void main(){gl_FragColor=vec4(1.0,0.0,0.0,1.0);}";

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const shaderProgram = createProgram(gl, vertexShader, fragmentShader);

    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);

    const positionBuffer = initBuffers(gl);

    const rotationMatrix = mat4.create();
    render(gl, shaderProgram, rotationMatrix);

    document.addEventListener('keydown', function (event) {
        handleKeyPress(event, gl, shaderProgram, rotationMatrix);
    });
});

function initBuffers(gl) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const vertices = new Float32Array([
        0.0,  1.0,
       -1.0, -1.0,
        1.0, -1.0
    ]);

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(gl.getAttribLocation(shaderProgram, "a_position"), 2, gl.FLOAT, false, 0, 0);

    return positionBuffer;
}

function render(gl, shaderProgram, rotationMatrix) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(shaderProgram);

    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "u_rotation"), false, rotationMatrix);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function handleKeyPress(event, gl, shaderProgram, rotationMatrix) {
    const rotationIncrement = (event.keyCode === 37) ? 0.1 : (event.keyCode === 39) ? -0.1 : 0;
    mat4.rotate(rotationMatrix, rotationMatrix, rotationIncrement, [0, 0, 1]);

    render(gl, shaderProgram, rotationMatrix);
}

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
