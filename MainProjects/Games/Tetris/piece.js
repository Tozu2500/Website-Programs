import { SHAPES, COLORS, COLS } from './constants.js';

export class Piece {
    constructor(type) {
        this.type = type;
        this.shape = SHAPES[type];
        this.color = COLORS[type];
        this.rotation = 0;
        this.x = Math.floor(COLS / 2) - 2;
        this.y = -1;
    }

    getCurrentShape() {
        return this.shape[this.rotation];
    }

    rotate(direction = 1) {
        const newRotation = (this.rotation + direction + 4) % 4;
        return newRotation;
    }

    getRotatedShape(rotation) {
        return this.shape[rotation];
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    setRotation(rotation) {
        this.rotation = rotation;
    }

    clone() {
        const newPiece = new Piece(this.type);
        newPiece.x = this.x;
        newPiece.y = this.y;
        newPiece.rotation = this.rotation;
        return newPiece;
    }

    reset() {
        this.rotation = 0;
        this.x = Math.floor(COLS / 2) - 2;
        this.y = -1;
    }

    getBlocks() {
        const blocks = [];
        const currentShape = this.getCurrentShape();
        
        for (let row = 0; row < currentShape.length; row++) {
            for (let col = 0; col < currentShape[row].length; col++) {
                if (currentShape[row][col]) {
                    blocks.push({
                        x: this.x + col,
                        y: this.y + row
                    });
                }
            }
        }
        
        return blocks;
    }

    getBlocksForShape(shape, x, y) {
        const blocks = [];
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    blocks.push({
                        x: x + col,
                        y: y + row
                    });
                }
            }
        }
        
        return blocks;
    }

    getBoundingBox() {
        const currentShape = this.getCurrentShape();
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

        return hasBlock ? {
            minX,
            maxX,
            minY,
            maxY,
            width: maxX - minX + 1,
            height: maxY - minY + 1
        } : null;
    }

    getLowestY() {
        const currentShape = this.getCurrentShape();
        let lowestY = -1;

        for (let row = currentShape.length - 1; row >= 0; row--) {
            for (let col = 0; col < currentShape[row].length; col++) {
                if (currentShape[row][col]) {
                    lowestY = Math.max(lowestY, row);
                    break;
                }
            }
            if (lowestY !== -1) break;
        }

        return this.y + lowestY;
    }

    getHighestY() {
        const currentShape = this.getCurrentShape();
        
        for (let row = 0; row < currentShape.length; row++) {
            for (let col = 0; col < currentShape[row].length; col++) {
                if (currentShape[row][col]) {
                    return this.y + row;
                }
            }
        }
        
        return this.y;
    }

    getLeftmostX() {
        const currentShape = this.getCurrentShape();
        
        for (let col = 0; col < currentShape[0].length; col++) {
            for (let row = 0; row < currentShape.length; row++) {
                if (currentShape[row][col]) {
                    return this.x + col;
                }
            }
        }
        
        return this.x;
    }

    getRightmostX() {
        const currentShape = this.getCurrentShape();
        
        for (let col = currentShape[0].length - 1; col >= 0; col--) {
            for (let row = 0; row < currentShape.length; row++) {
                if (currentShape[row][col]) {
                    return this.x + col;
                }
            }
        }
        
        return this.x;
    }
}