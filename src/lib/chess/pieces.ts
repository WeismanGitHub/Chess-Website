import { Color } from '../../types'
import Square from './square'
import Board from './board'

function universalCheck(_target: Object, _propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.value

    descriptor.value = function (board: Board, start: Square, end: Square) {
        if (!start.piece) return false

        if (start.piece.color === end.piece?.color) return false

        const result = originalMethod.apply(this, board, start, end)

        return result
    }

    return descriptor
}

export abstract class Piece {
    public color: Color
    abstract character: string // It will look different with the custom font.

    constructor(color: Color = 'white') {
        this.color = color
    }

    abstract canMove(board: Board, start: Square, end: Square): boolean

    getCharacter() {
        return this.character
    }
}

export class King extends Piece {
    public character = 'l'
    public canCastle = true

    @universalCheck
    canMove(_board: Board, _start: Square, _end: Square): boolean {
        throw new Error('Method not implemented.')
    }
}

export class Queen extends Piece {
    public character = 'w'

    @universalCheck
    canMove(_board: Board, _start: Square, _end: Square): boolean {
        throw new Error('Method not implemented.')
    }
}

export class Bishop extends Piece {
    public character = 'v'

    @universalCheck
    canMove(_board: Board, _start: Square, _end: Square): boolean {
        throw new Error('Method not implemented.')
    }
}

export class Knight extends Piece {
    public character = 'm'

    @universalCheck
    canMove(_board: Board, _start: Square, _end: Square): boolean {
        throw new Error('Method not implemented.')
    }
}

export class Rook extends Piece {
    public character = 't'

    @universalCheck
    canMove(_board: Board, _start: Square, _end: Square): boolean {
        throw new Error('Method not implemented.')
    }
}

export class Pawn extends Piece {
    public character = 'o'

    @universalCheck
    canMove(_board: Board, _start: Square, _end: Square): boolean {
        throw new Error('Method not implemented.')
    }
}
