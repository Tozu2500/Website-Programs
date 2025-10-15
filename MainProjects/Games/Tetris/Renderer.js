import { BLOCK_SIZE, COLS, ROWS, COLORS } from './constants.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.animationQueue = [];
        this.particleSystem = [];
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBlock(x, y, color, alpha = 1) {
        const pixelX = x * BLOCK_SIZE;
        const pixelY = y * BLOCK_SIZE;

        this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(pixelX, pixelY, BLOCK_SIZE, BLOCK_SIZE);

        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(pixelX, pixelY, BLOCK_SIZE, BLOCK_SIZE);

        const gradient = this.ctx.createLinearGradient(
            pixelX, pixelY,
            pixelX + BLOCK_SIZE, pixelY + BLOCK_SIZE
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(pixelX + 2, pixelY + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);

        this.ctx.globalAlpha = 1;
    }

    drawGrid() {
        this.ctx.strokeStyle = COLORS.GRID;
        this.ctx.lineWidth = 0.5;

        for (let x = 0; x <= COLS; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * BLOCK_SIZE, 0);
            this.ctx.lineTo(x * BLOCK_SIZE, ROWS * BLOCK_SIZE);
            this.ctx.stroke();
        }

        for (let y = 0; y <= ROWS; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * BLOCK_SIZE);
            this.ctx.lineTo(COLS * BLOCK_SIZE, y * BLOCK_SIZE);
            this.ctx.stroke();
        }
    }

    drawBoard(board) {
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const color = board.grid[row][col];
                if (color !== COLORS.EMPTY) {
                    this.drawBlock(col, row, color);
                }
            }
        }
    }

    drawPiece(piece, alpha = 1) {
        const currentShape = piece.getCurrentShape();
        
        for (let row = 0; row < currentShape.length; row++) {
            for (let col = 0; col < currentShape[row].length; col++) {
                if (currentShape[row][col]) {
                    const x = piece.x + col;
                    const y = piece.y + row;
                    if (y >= 0) {
                        this.drawBlock(x, y, piece.color, alpha);
                    }
                }
            }
        }
    }

    drawGhostPiece(piece, ghostY) {
        const currentShape = piece.getCurrentShape();
        
        for (let row = 0; row < currentShape.length; row++) {
            for (let col = 0; col < currentShape[row].length; col++) {
                if (currentShape[row][col]) {
                    const x = piece.x + col;
                    const y = ghostY + row;
                    if (y >= 0) {
                        this.drawBlock(x, y, COLORS.GHOST, 0.3);
                    }
                }
            }
        }
    }

    drawPreviewPiece(ctx, piece, canvasWidth, canvasHeight) {
        if (!piece) return;

        const currentShape = piece.getCurrentShape();
        let minX = 4, maxX = 0, minY = 4, maxY = 0;
        let hasBlock = false;

        for (let row = 0; row < currentShape.length; row++) {
            for (let col = 0; col < currentShape[row].length; col++) {
                if (currentShape[row][col]) {
                    hasBlock = true;
                    minX = Math.min(minX, col);
                    maxX = Math.max(maxX, col);
                    minY = Math.min(minY, row);
                    maxY = Math.max(maxY, row);
                }
            }
        }

        if (!hasBlock) return;

        const pieceWidth = (maxX - minX + 1) * BLOCK_SIZE;
        const pieceHeight = (maxY - minY + 1) * BLOCK_SIZE;
        const offsetX = (canvasWidth - pieceWidth) / 2 - minX * BLOCK_SIZE;
        const offsetY = (canvasHeight - pieceHeight) / 2 - minY * BLOCK_SIZE;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        for (let row = 0; row < currentShape.length; row++) {
            for (let col = 0; col < currentShape[row].length; col++) {
                if (currentShape[row][col]) {
                    const x = offsetX + col * BLOCK_SIZE;
                    const y = offsetY + row * BLOCK_SIZE;

                    ctx.fillStyle = piece.color;
                    ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);

                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(x, y, BLOCK_SIZE, BLOCK_SIZE);

                    const gradient = ctx.createLinearGradient(
                        x, y, x + BLOCK_SIZE, y + BLOCK_SIZE
                    );
                    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
                    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
                    
                    ctx.fillStyle = gradient;
                    ctx.fillRect(x + 2, y + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);
                }
            }
        }
    }

    animateLineClear(lines, callback) {
        let frame = 0;
        const maxFrames = 30;
        const animate = () => {
            frame++;
            
            if (frame <= maxFrames) {
                requestAnimationFrame(animate);
            } else {
                if (callback) callback();
            }
        };
        
        animate();
    }

    createParticle(x, y, color) {
        return {
            x: x * BLOCK_SIZE + BLOCK_SIZE / 2,
            y: y * BLOCK_SIZE + BLOCK_SIZE / 2,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4 - 2,
            color: color,
            life: 1,
            decay: 0.02,
            size: BLOCK_SIZE / 3
        };
    }

    addParticles(x, y, color, count = 5) {
        for (let i = 0; i < count; i++) {
            this.particleSystem.push(this.createParticle(x, y, color));
        }
    }

    updateParticles() {
        for (let i = this.particleSystem.length - 1; i >= 0; i--) {
            const particle = this.particleSystem[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.2;
            particle.life -= particle.decay;
            
            if (particle.life <= 0) {
                this.particleSystem.splice(i, 1);
            }
        }
    }

    drawParticles() {
        for (const particle of this.particleSystem) {
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(
                particle.x - particle.size / 2,
                particle.y - particle.size / 2,
                particle.size,
                particle.size
            );
        }
        this.ctx.globalAlpha = 1;
    }

    flashLine(row, intensity = 1) {
        this.ctx.globalAlpha = intensity;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, row * BLOCK_SIZE, COLS * BLOCK_SIZE, BLOCK_SIZE);
        this.ctx.globalAlpha = 1;
    }

    render(board, currentPiece, ghostY) {
        this.clear();
        this.drawGrid();
        this.drawBoard(board);
        
        if (currentPiece && ghostY !== null) {
            this.drawGhostPiece(currentPiece, ghostY);
        }
        
        if (currentPiece) {
            this.drawPiece(currentPiece);
        }
        
        this.updateParticles();
        this.drawParticles();
    }

    clearCanvas(ctx, width, height) {
        ctx.clearRect(0, 0, width, height);
    }

    drawBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, ROWS * BLOCK_SIZE);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);
    }

    highlightRow(row, color = 'rgba(255, 255, 255, 0.5)') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, row * BLOCK_SIZE, COLS * BLOCK_SIZE, BLOCK_SIZE);
    }

    drawText(text, x, y, size = 20, color = '#ffffff') {
        this.ctx.font = `bold ${size}px Arial`;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, x, y);
    }
}