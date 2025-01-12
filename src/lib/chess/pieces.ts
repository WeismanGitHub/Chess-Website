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

    abstract canMove(game: Game, start: Square, end: Square): boolean

    makeMove(game: Game, start: Square, end: Square, promotion?: Piece): void {
        const piece = start.piece

        if (!piece) {
            throw new Error("There's no piece on that square.")
        }

        // switch (true) {
        //     case piece instanceof Pawn: {
        //         start.piece = null

        //         if (end.row === this.board.rows) {
        //             end.piece = promotion
        //         } else {
        //             end.piece = piece
        //         }

        //         break
        //     }

        //     case piece instanceof King: {
        //         throw new Error('Not Implemented')
        //         // castling stuff
        //     }

        //     default:
        //         end.piece = piece
        //         start.piece = null
        //         break
        // }
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

    override makeMove(game: Game, start: Square, end: Square): void {}
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
    canMove(_game: Game, start: Square, end: Square): boolean {
        if (!end.piece) {
            return this.squaresAreVertical(start, end)
        }

        return this.squaresAreVertical(start, end) || end.col === start.col + 1 || end.col === start.col - 1
    }

    override makeMove(game: Game, start: Square, end: Square, promotion?: Piece): void {
        console.log(game, start, end, promotion)
    }
}
