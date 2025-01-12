import { Color } from '../../types'
import Square from './square'
import Game from './game'

function universalCheck(_target: Object, _propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.value

    descriptor.value = function (game: Game, start: Square, end: Square) {
        if (!start.piece || start.piece.color === end.piece?.color) {
            return false
        }

        const king = game.board.getKingSquare(start.piece.color).piece

        if (king.isInCheck(game)) {
            return false
        }

        return originalMethod.apply(this, [game, start, end])
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

    squaresAreDiagonal(start: Square, end: Square): boolean {
        return start.col - end.col === start.row - end.row
    }

    squaresAreVertical(start: Square, end: Square): boolean {
        return start.col === end.col
    }

    squaresAreHorizontal(start: Square, end: Square): boolean {
        return start.row === end.row
    }
}

export class King extends Piece {
    public character = 'l'
    public canCastle = true

    @universalCheck
    canMove(_board: Board, _start: Square, _end: Square): boolean {
        throw new Error('Method not implemented.')
    }

    isInCheck(_board: Board): boolean {
        return false
    }

    IsInCheckmate(_board: Boolean): boolean {
        return false
    }
}

export class Queen extends Piece {
    public character = 'w'

    @universalCheck
    canMove(_board: Board, start: Square, end: Square): boolean {
        return (
            this.squaresAreDiagonal(start, end) ||
            this.squaresAreHorizontal(start, end) ||
            this.squaresAreVertical(start, end)
        )
    }
}

export class Bishop extends Piece {
    public character = 'v'

    @universalCheck
    canMove(_board: Board, start: Square, end: Square): boolean {
        return this.squaresAreDiagonal(start, end)
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
    canMove(_board: Board, start: Square, end: Square): boolean {
        return this.squaresAreHorizontal(start, end)
    }
}

export class Pawn extends Piece {
    public character = 'o'

    @universalCheck
    canMove(_board: Board, start: Square, end: Square): boolean {
        if (!end.piece) {
            return this.squaresAreVertical(start, end)
        }

        return this.squaresAreVertical(start, end) || end.col === start.col + 1 || end.col === start.col - 1
    }
}
