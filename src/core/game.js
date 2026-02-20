import { Grid } from './grid.js';
import { getRandomTetromino, rotateMatrix } from './tetromino.js';
import { Renderer } from '../ui/renderer.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.renderer = new Renderer(canvas, this.ctx);
        this.grid = new Grid();

        this.activePiece = null;
        this.nextPiece = getRandomTetromino();
        this.holdPiece = null;
        this.canHold = true;

        this.score = 0;
        this.level = 1;
        this.lines = 0;

        this.gameOver = false;
        this.paused = false;

        this.dropInterval = 1000;
        this.lastTime = 0;
        this.dropCounter = 0;

        this.bindInput();
        this.reset();
    }

    reset() {
        this.grid.reset();
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.holdPiece = null;
        this.canHold = true;
        this.gameOver = false;
        this.paused = false;
        this.dropInterval = 1000;
        this.spawnPiece();
        this.updateScoreUI();
    }

    spawnPiece() {
        this.activePiece = this.nextPiece;
        this.nextPiece = getRandomTetromino();
        this.canHold = true;

        // Center the piece
        this.activePiece.x = Math.floor((this.grid.cols - this.activePiece.shape[0].length) / 2);
        this.activePiece.y = 0; // Start at top

        // Instant Game Over Check
        if (this.grid.collides(this.activePiece.x, this.activePiece.y, this.activePiece.shape)) {
            this.activePiece.y = -1; // Just for visual
            this.gameOver = true;
            console.log("Game Over!");
        }
    }

    bindInput() {
        document.addEventListener('keydown', (event) => {
            if (this.gameOver) return;

            if (event.key === 'Escape') {
                this.paused = !this.paused;
                const overlay = document.getElementById('game-overlay');
                if (this.paused) {
                    overlay.classList.remove('hidden');
                } else {
                    overlay.classList.add('hidden');
                }
                return;
            }

            if (this.paused) return;

            if (event.code === 'ArrowLeft') {
                this.move(-1);
            } else if (event.code === 'ArrowRight') {
                this.move(1);
            } else if (event.code === 'ArrowDown') {
                this.drop();
            } else if (event.code === 'ArrowUp') {
                this.rotate();
            } else if (event.code === 'Space') {
                this.hardDrop();
            } else if (event.code === 'KeyC') {
                this.hold();
            }
        });
    }

    hold() {
        if (!this.canHold || this.gameOver || this.paused) return;

        if (this.holdPiece === null) {
            this.holdPiece = this.activePiece;
            this.spawnPiece();
        } else {
            const temp = this.activePiece;
            this.activePiece = this.holdPiece;
            this.holdPiece = temp;

            // Reset position of swapped piece
            this.activePiece.x = Math.floor((this.grid.cols - this.activePiece.shape[0].length) / 2);
            this.activePiece.y = 0;
        }

        this.canHold = false;
    }

    move(dir) {
        const newX = this.activePiece.x + dir;
        if (!this.grid.collides(newX, this.activePiece.y, this.activePiece.shape)) {
            this.activePiece.x = newX;
        }
    }

    rotate() {
        const rotatedShape = rotateMatrix(this.activePiece.shape);
        // Basic wall kick: check if rotation logic collides, if so, try shifting x
        const pos = this.activePiece.x;
        let offset = 1;

        // Simple kick logic: try centered, then left, then right
        if (!this.grid.collides(pos, this.activePiece.y, rotatedShape)) {
            this.activePiece.shape = rotatedShape;
            return;
        }

        // Try kicking
        if (!this.grid.collides(pos + offset, this.activePiece.y, rotatedShape)) {
            this.activePiece.x += offset;
            this.activePiece.shape = rotatedShape;
            return;
        }
        if (!this.grid.collides(pos - offset, this.activePiece.y, rotatedShape)) {
            this.activePiece.x -= offset;
            this.activePiece.shape = rotatedShape;
            return;
        }
        // If still collides, do not rotate
    }

    drop() {
        if (this.paused || this.gameOver) return;

        const newY = this.activePiece.y + 1;
        if (!this.grid.collides(this.activePiece.x, newY, this.activePiece.shape)) {
            this.activePiece.y = newY;
            this.dropCounter = 0; // Reset drop counter if manually dropped
        } else {
            // Lock
            this.lock();
        }
    }

    hardDrop() {
        while (!this.grid.collides(this.activePiece.x, this.activePiece.y + 1, this.activePiece.shape)) {
            this.activePiece.y++;
        }
        this.lock();
    }

    lock() {
        this.grid.lockPiece(this.activePiece);
        const linesCleared = this.grid.clearLines();
        if (linesCleared > 0) {
            this.updateScore(linesCleared);
        }
        this.spawnPiece();
    }

    updateScore(lines) {
        const points = [0, 40, 100, 300, 1200];
        this.score += points[lines] * this.level;
        this.lines += lines;
        this.level = Math.floor(this.lines / 10) + 1;
        // Speed up
        this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);

        this.updateScoreUI();
    }

    updateScoreUI() {
        document.getElementById('score').innerText = this.score;
        document.getElementById('level').innerText = this.level;
        document.getElementById('lines').innerText = this.lines;
    }

    update(deltaTime) {
        if (this.gameOver || this.paused) return;

        this.dropCounter += deltaTime;
        if (this.dropCounter > this.dropInterval) {
            this.drop();
            this.dropCounter = 0;
        }
    }

    draw() {
        this.renderer.clear();
        this.renderer.drawGrid(this.grid.grid);
        this.renderer.drawPiece(this.activePiece);

        this.renderer.drawPreview('next-canvas', this.nextPiece);
        this.renderer.drawPreview('hold-canvas', this.holdPiece);
    }

    start() {
        const loop = (time = 0) => {
            const deltaTime = time - this.lastTime;
            this.lastTime = time;

            this.update(deltaTime);
            this.draw();

            if (!this.gameOver) {
                requestAnimationFrame(loop);
            } else {
                // Show Game Over UI
                const overlay = document.getElementById('game-overlay');
                const title = document.getElementById('overlay-title');
                title.innerText = "GAME OVER";
                overlay.classList.remove('hidden');
            }
        };
        loop();
    }
}
