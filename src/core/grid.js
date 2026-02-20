export class Grid {
    constructor(cols = 10, rows = 20) {
        this.cols = cols;
        this.rows = rows;
        this.grid = this.createGrid();
    }

    createGrid() {
        return Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
    }

    reset() {
        this.grid = this.createGrid();
    }

    // Check if a position is within the grid walls and floor
    isValid(x, y) {
        return x >= 0 && x < this.cols && y < this.rows;
    }

    // Check if a cell is empty (0)
    isEmpty(x, y) {
        return this.isValid(x, y) && this.grid[y] && this.grid[y][x] === 0;
    }

    // Check if a piece collides with existing blocks or walls
    collides(pieceX, pieceY, shape) {
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] !== 0) {
                    const newX = pieceX + x;
                    const newY = pieceY + y;

                    // 1. Check walls/floor
                    if (newX < 0 || newX >= this.cols || newY >= this.rows) {
                        return true;
                    }

                    // 2. Check existing blocks (only if within vertical bounds; 
                    //    above-top doesn't collide usually unless we want top-out logic there)
                    if (newY >= 0 && this.grid[newY] && this.grid[newY][newX] !== 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // Lock a piece into the grid
    lockPiece(piece) {
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x] !== 0) {
                    // Ignore parts of the piece that are above the board (game over check elsewhere)
                    if (piece.y + y >= 0) {
                        this.grid[piece.y + y][piece.x + x] = piece.color;
                    }
                }
            }
        }
    }

    // Clear filled lines and return number of lines cleared
    clearLines() {
        let linesCleared = 0;

        for (let y = this.rows - 1; y >= 0; y--) {
            if (this.grid[y].every(cell => cell !== 0)) {
                // Remove the row
                this.grid.splice(y, 1);
                // Add a new empty row at the top
                this.grid.unshift(Array(this.cols).fill(0));
                linesCleared++;
                // Check this index again because rows shifted down
                y++;
            }
        }

        return linesCleared;
    }
}
