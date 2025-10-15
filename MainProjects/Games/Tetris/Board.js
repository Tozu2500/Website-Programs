import { COLS, ROWS, COLORS } from './constants.js';

export class Board {
    constructor() {
        this.grid = this.createEmptyGrid();
        this.clearedLines = [];
    }

    createEmptyGrid() {
        const grid = [];
        for (let row = 0; row < ROWS; row++) {
            grid[row] = [];
            for (let col = 0; col < COLS; col++) {
                grid[row][col] = COLORS.EMPTY;
            }
        }
        return grid;
    }

    reset() {
        this.grid = this.createEmptyGrid();
        this.clearedLines = [];
    }

    isValidMove(piece, x, y, shape) {
        const shapeToCheck = shape || piece.getCurrentShape();

        for (let row = 0; row < shapeToCheck.length; row++) {
            for (let col = 0; col < shapeToCheck[row].length; col++) {
                if (shapeToCheck[row][col]) {
                    const newX = x + col;
                    const newY = y + row;

                    if (newX < 0 || newX >= COLS || newY >= ROWS) {
                        return false;
                    }

                    if (newY >= 0 && this.grid[newY][newX] !== COLORS.EMPTY) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    lockPiece(piece) {
        const currentShape = piece.getCurrentShape();

        for (let row = 0; row < currentShape.length; row++) {
            for (let col = 0; col < currentShape[row].length; col++) {
                if (currentShape[row][col]) {
                    const x = piece.x + col;
                    const y = piece.y + row;

                    if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
                        this.grid[y][x] = piece.color;
                    }
                }
            }
        }
    }

    clearLines() {
        const linesToClear = [];

        for (let row = ROWS - 1; row >= 0; row--) {
            let isFull = true;
            for (let col = 0; col < COLS; col++) {
                if (this.grid[row][col] === COLORS.EMPTY) {
                    isFull = false;
                    break;
                }
            }
            if (isFull) {
                linesToClear.push(row);
            }
        }

        return linesToClear;
    }

    removeLines(lines) {
        this.clearedLines = lines;

        for (let i = lines.length - 1; i >= 0; i--) {
            this.grid.splice(lines[i], 1);
            this.grid.unshift(new Array(COLS).fill(COLORS.EMPTY));
        }

        return lines.length;
    }

    getCell(x, y) {
        if (x < 0 || x >= COLS || y < 0 || y >= ROWS) {
            return null;
        }
        return this.grid[y][x];
    }

    setCell(x, y, color) {
        if (x >= 0 && x < COLS && y >= 0 && y < ROWS) {
            this.grid[y][x] = color;
        }
    }

    isEmpty(x, y) {
        if (x < 0 || x >= COLS || y < 0 || y >= ROWS) {
            return false;
        }
        return this.grid[y][x] === COLORS.EMPTY;
    }

    isRowFull(row) {
        if (row < 0 || row >= ROWS) {
            return false;
        }

        for (let col = 0; col < COLS; col++) {
            if (this.grid[row][col] === COLORS.EMPTY) {
                return false;
            }
        }

        return true;
    }

    isRowEmpty(row) {
        if (row < 0 || row >= ROWS) {
            return false;
        }

        for (let col = 0; col < COLS; col++) {
            if (this.grid[row][col] !== COLORS.EMPTY) {
                return false;
            }
        }

        return true;
    }

    getHighestBlock() {
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (this.grid[row][col] !== COLORS.EMPTY) {
                    return row;
                }
            }
        }
        return ROWS;
    }

    getColumnHeight(col) {
        if (col < 0 || col >= COLS) {
            return 0;
        }

        for (let row = 0; row < ROWS; row++) {
            if (this.grid[row][col] !== COLORS.EMPTY) {
                return ROWS - row;
            }
        }

        return 0;
    }

    getHoles() {
        let holes = 0;

        for (let col = 0; col < COLS; col++) {
            let foundBlock = false;
            for (let row = 0; row < ROWS; row++) {
                if (this.grid[row][col] !== COLORS.EMPTY) {
                    foundBlock = true;
                } else if (foundBlock) {
                    holes++;
                }
            }
        }

        return false;
    }

    getBumpiness() {
        let bumpiness = 0;
        let previousHeight = this.getColumnHeight(0);

        for (let col = 1; col < COLS; col++) {
            const currentHeight = this.getColumnHeight(col);
            bumpiness += Math.abs(currentHeight - previousHeight);
            previousHeight = currentHeight;
        }

        return bumpiness;
    }

    getAggregateHeight() {
        let totalHeight = 0;

        for (let col = 0; col < COLS; col++) {
            totalHeight += this.getColumnHeight(col);
        }

        return totalHeight;
    }

    clone() {
        const newBoard = new Board();
        newBoard.grid = this.grid.map(row => [...row]);
        return newBoard;
    }

    getGridCopy() {
        return this.grid.map(row => [...row]);
    }

    setGrid(grid) {
        this.grid = grid.map(row => [...row]);
    }

    isGameOver() {
        for (let col = 0; col < COLS; col++) {
            if (this.grid[0][col] !== COLORS.EMPTY) {
                return true;
            }
        }
        return false;
    }

    getFullRows() {
        const fullRows = [];
        for (let row = 0; row < ROWS; row++) {
            if (this.isRowFull(row)) {
                fullRows.push(row);
            }
        }

        return fullRows;
    }

    getEmptyRows() {
        const emptyRows = [];
        for (let row = 0; row < ROWS; row++) {
            if (this.isRowEmpty(row)) {
                emptyRows.push(row);
            }
        }
        return emptyRows;
    }
}