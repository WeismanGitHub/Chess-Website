import Board from './board'

export abstract class Piece {
    public white: boolean
    public dead: boolean = false

    constructor(white: boolean) {
        this.white = white
    }

    abstract canMove(board: Board, x: number, y: number): boolean
}

export class King extends Piece {
    public canCastle = true

    canMove(board: Board, x: number, y: number): boolean {
        throw new Error('Method not implemented.')
    }
}

export class Queen extends Piece {
    canMove(board: Board, x: number, y: number): boolean {
        throw new Error('Method not implemented.')
    }
}

export class Bishop extends Piece {
    canMove(board: Board, x: number, y: number): boolean {
        throw new Error('Method not implemented.')
    }
}

export class Knight extends Piece {
    canMove(board: Board, x: number, y: number): boolean {
        throw new Error('Method not implemented.')
    }
}

export class Rook extends Piece {
    canMove(board: Board, x: number, y: number): boolean {
        throw new Error('Method not implemented.')
    }
}

export class Pawn extends Piece {
    canMove(board: Board, x: number, y: number): boolean {
        throw new Error('Method not implemented.')
    }
}
