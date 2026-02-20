export class Renderer {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.ctx = context;
        this.blockSize = 30; // Hardcoded for now, should match Game constants
        this.cols = 10;
        this.rows = 20;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGrid(grid) {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (grid[y][x] !== 0) {
                    this.drawBlock(x, y, grid[y][x]);
                }
            }
        }
    }

    drawPiece(piece) {
        if (!piece) return;

        piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.drawBlock(piece.x + x, piece.y + y, piece.color);
                }
            });
        });
    }

    drawBlock(x, y, color) {
        const size = this.blockSize;
        const padding = 2;

        this.ctx.fillStyle = color;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = color;
        this.ctx.fillRect(x * size + padding, y * size + padding, size - padding * 2, size - padding * 2);

        // Inner highlight for 3D effect
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fillRect(x * size + padding, y * size + padding, size - padding * 2, 4);
    }

    drawPreview(canvasId, piece) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dark background for preview
        ctx.fillStyle = '#0a0a12';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (!piece) return;

        // Calculate center offset
        const blockSize = 20; // Smaller blocks for preview
        const PieceWidth = piece.shape[0].length * blockSize;
        const PieceHeight = piece.shape.length * blockSize;

        const offsetX = (canvas.width - PieceWidth) / 2;
        const offsetY = (canvas.height - PieceHeight) / 2;

        piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    // Draw block in preview
                    const padding = 2;
                    ctx.fillStyle = piece.color;
                    ctx.fillRect(offsetX + x * blockSize + padding, offsetY + y * blockSize + padding, blockSize - padding * 2, blockSize - padding * 2);
                }
            });
        });
    }
}
