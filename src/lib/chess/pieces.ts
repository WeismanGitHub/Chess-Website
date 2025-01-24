import { Color } from '../../types'
import Square from './square'
import Game from './game'

function universalCheck(_target: Object, _propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.value

    descriptor.value = function (game: Game, start: Square, end: Square) {
        if (!start.piece || start.piece.color === end.piece?.color) {
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

    abstract canMove(game: Game, start: Square, end: Square): boolean

    makeMove(game: Game, start: Square, end: Square, promotion?: Piece): void {
        const piece = start.piece

        if (!piece) {
            throw new Error("There's no piece on that square.")
        }

        if (piece.canMove(game, start, end)) {
            piece.makeMove(game, start, end, promotion)
        }
    }

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
    canMove(_game: Game, _start: Square, _end: Square): boolean {
        throw new Error('Method not implemented.')
    }

    isInCheck(_game: Game): boolean {
        return false
    }

    IsInCheckmate(_game: Game): boolean {
        return false
    }

    // override makeMove(game: Game, start: Square, end: Square): void {}
}

export class Queen extends Piece {
    public character = 'w'

    @universalCheck
    canMove(_game: Game, start: Square, end: Square): boolean {
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
    canMove(_game: Game, start: Square, end: Square): boolean {
        return this.squaresAreDiagonal(start, end)
    }
}

export class Knight extends Piece {
    public character = 'm'

    @universalCheck
    canMove(_game: Game, _start: Square, _end: Square): boolean {
        throw new Error('Method not implemented.')
    }
}

export class Rook extends Piece {
    public character = 't'

    @universalCheck
    canMove(_game: Game, start: Square, end: Square): boolean {
        return this.squaresAreHorizontal(start, end)
    }
}

export class Pawn extends Piece {
    public character = 'o'

    @universalCheck
    isValidMove(_game: Game, start: Square, end: Square): boolean {
        if (!this.squaresAreVertical(start, end)) {
            return false
        }

        if (this.color === 'white') {
            // If pawn hasn't moved
            if (start.row === 1) {
                return start.row + 1 === end.row || start.row + 2 === end.row
            }

            return start.row + 1 === end.row
        }

        // If pawn hasn't moved
        if (start.row === 6) {
            return start.row - 1 === end.row || start.row - 2 === end.row
        }

        return start.row - 1 === end.row
    }

    override executeMove(game: Game, start: Square, end: Square, promotion?: Piece): void {
        if (this.color === 'white' ? end.row === game.board.rows : end.row === 0) {
            if (!promotion) {
                throw new Error('Promotion piece is required.')
            }

            end.piece = promotion
        } else {
            end.piece = start.piece
        }

        start.piece = null
    }
}
