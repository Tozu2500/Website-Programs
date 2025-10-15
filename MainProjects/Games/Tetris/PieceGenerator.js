import { PIECE_TYPES } from "./constants";
import { Piece } from "./piece";

export class PieceGenerator {
    constructor() {
        this.bag = [];
        this.nextPieces = [];
        this.initializeQueue();
    }

    initializeQueue() {
        for (let i = 0; i < 5; i++) {
            this.nextPieces.push(this.generatePiece());
        }
    }

    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    generateBag() {
        return this.shuffle([...PIECE_TYPES]);
    }

    generatePiece() {
        if (this.bag.length === 0) {
            this.bag = this.generateBag();
        }

        const type = this.bag.pop();
        return new Piece(type);
    }

    getNextPiece() {
        const piece = this.nextPieces.shift();
        this.nextPieces.push(this.generatePiece());
        return piece;
    }

    peekNext(index = 0) {
        if (index >= 0 && index < this.nextPieces.length) {
            return this.nextPieces[index];
        }
        return null;
    }

    peekAll() {
        return [...this.nextPieces];
    }

    reset() {
        this.bag = [];
        this.nextPieces = [];
        this.initializeQueue();
    }

    getNextPieces(count) {
        const pieces = [];
        for (let i = 0; i < Math.min(count, this.nextPieces.length); i++) {
            pieces.push(this.nextPieces[i]);
        }
        return pieces;
    }

    setNextPieces(pieces) {
        this.nextPieces = pieces.map(piece => {
            if (typeof piece === 'string') {
                return new Piece(piece);
            }
            return piece;
        });
    }

    insertNextPiece(piece, index = 0) {
        if (index >= 0 && index <= this.nextPieces.length) {
            this.nextPieces.splice(index, 0, piece);
        }
    }

    removeNextPiece(index) {
        if (index >= 0 && index < this.nextPieces.length) {
            return this.nextPieces.splice(index, 1)[0];
        }
        return null;
    }

    swapNextPieces(index1, index2) {
        if (index1 >= 0 && index1 < this.nextPieces.length &&
            index2 >= 0 && index2 < this.nextPieces.length) {
            [this.nextPieces[index1], this.nextPieces[index2]] =
            [this.nextPieces[index2], this.nextPieces[index1]];
        }
    }

    getBagState() {
        return {
            bag: [...this.bag],
            nextPieces: this.nextPieces.map(p => p.type)
        };
    }

    setBagState(state) {
        this.bag = [...state.bag];
        this.nextPieces = state.nextPieces.map(type => new Piece(type));
    }

    getRemainingInBag() {
        return this.bag.length;
    }

    hasNextPiece() {
        return this.nextPieces.length > 0;
    }

    clearNextPieces() {
        this.nextPieces = [];
    }

    refillQueue(count) {
        while (this.nextPieces.length < count) {
            this.nextPieces.push(this.generatePiece());
        }
    }

    getPieceAtIndex(index) {
        if (index >= 0 && index < this.nextPieces.length) {
            return this.nextPieces[index];
        }
        return null;
    }

    getQueueLength() {
        return this.nextPieces.length;
    }

    isQueueEmpty() {
        return this.nextPieces.length === 0;
    }

    popFromBag() {
        if (this.bag.length === 0) {
            this.bag = this.generateBag();
        }
        return this.bag.pop();
    }

    peekBag() {
        return [...this.bag];
    }

    getBagLength() {
        return this.bag.length;
    }
}