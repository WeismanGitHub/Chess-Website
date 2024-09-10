import Square from './square'
import Board from './board'

export abstract class Piece {
    public color: Color
    public dead: boolean = false

    constructor(color: Color = 'white') {
        this.color = color
    }

    abstract canMove(board: Board, start: Square, end: Square): boolean
}

export class King extends Piece {
    public canCastle = true

    canMove(board: Board, start: Square, end: Square): boolean {
        throw new Error('Method not implemented.')
    }
}

export class Queen extends Piece {
    canMove(board: Board, start: Square, end: Square): boolean {
        throw new Error('Method not implemented.')
    }
}

export class Bishop extends Piece {
    canMove(board: Board, start: Square, end: Square): boolean {
        throw new Error('Method not implemented.')
    }
}

export class Knight extends Piece {
    canMove(board: Board, start: Square, end: Square): boolean {
        throw new Error('Method not implemented.')
    }
}

export class Rook extends Piece {
    canMove(board: Board, start: Square, end: Square): boolean {
        throw new Error('Method not implemented.')
    }
}

export class Pawn extends Piece {
    canMove(board: Board, start: Square, end: Square): boolean {
        throw new Error('Method not implemented.')
    }
}
