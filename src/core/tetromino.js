export const TETROMINOES = {
    I: {
        shape: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        color: '#00f0ff' // Cyan
    },
    J: {
        shape: [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: '#0000ff' // Blue
    },
    L: {
        shape: [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: '#ffaa00' // Orange
    },
    O: {
        shape: [
            [1, 1],
            [1, 1]
        ],
        color: '#ffff00' // Yellow
    },
    S: {
        shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ],
        color: '#00ff00' // Green
    },
    T: {
        shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: '#aa00ff' // Purple
    },
    Z: {
        shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ],
        color: '#ff0000' // Red
    }
};

export function getRandomTetromino() {
    const keys = Object.keys(TETROMINOES);
    const randKey = keys[Math.floor(Math.random() * keys.length)];
    const tetromino = TETROMINOES[randKey];
    return {
        type: randKey,
        shape: tetromino.shape, // Clone if we need to mutate, but rotation returns new matrix usually
        color: tetromino.color,
        x: 0,
        y: 0
    };
}

export function rotateMatrix(matrix) {
    const N = matrix.length;
    const rotated = matrix.map((row, i) =>
        row.map((val, j) => matrix[N - 1 - j][i])
    );
    return rotated;
}
