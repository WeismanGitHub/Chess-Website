import { Color } from '../../types'
import Square from './square'
import Game from './game'

export abstract class Piece {
    public color: Color
    abstract character: string // It will look different with the custom font.

    constructor(color: Color = 'white') {
        this.color = color
    }

    abstract isValidMove(start: Square, end: Square, game: Game): boolean

    executeMove(start: Square, end: Square, _game: Game, _promotion?: Piece): void {
        const piece = start.piece

        if (!piece) {
            throw new Error("There's no piece on that square.")
        }

        end.piece = start.piece
        start.piece = null
    }

    getCharacter() {
        return this.character
    }

    squaresAreDiagonal(start: Square, end: Square): boolean {
        return Math.abs(start.col - end.col) === Math.abs(start.row - end.row)
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
    private hasMoved = false

    isValidMove(start: Square, end: Square, game: Game): boolean {
        if (Math.abs(start.col - end.col) <= 1 && Math.abs(start.row - end.row) <= 1) {
            return true
        }

        // const isCastlingMove = start.row === end.row && Math.abs(start.col - end.col) === 2

        // if (this.hasMoved && isCastlingMove) {
        //     return false
        // }
        console.log(game, this.hasMoved)

        return false
    }

    isInCheck(_game: Game): boolean {
        return false
    }

    IsInCheckmate(_game: Game): boolean {
        return false
    }

    // override executeMove(start: Square, end: Square, game: Game): void {
    //     this.hasMoved = true
    // }
}

export class Queen extends Piece {
    public character = 'w'

    isValidMove(start: Square, end: Square): boolean {
        return (
            this.squaresAreDiagonal(start, end) ||
            this.squaresAreHorizontal(start, end) ||
            this.squaresAreVertical(start, end)
        )
    }
}

export class Bishop extends Piece {
    public character = 'v'

    isValidMove(start: Square, end: Square): boolean {
        return this.squaresAreDiagonal(start, end)
    }
}

export class Knight extends Piece {
    public character = 'm'

    isValidMove(start: Square, end: Square): boolean {
        const validTransformations = [
            {
                col: 2,
                row: 1,
            },
            {
                col: 2,
                row: -1,
            },
            {
                col: -2,
                row: 1,
            },
            {
                col: -2,
                row: -1,
            },
            {
                col: 1,
                row: 2,
            },
            {
                col: -1,
                row: 2,
            },
            {
                col: 1,
                row: -2,
            },
            {
                col: -1,
                row: -2,
            },
        ]

        for (const trans of validTransformations) {
            if (start.col + trans.col === end.col && start.row + trans.row === end.row) {
                return true
            }
        }

        return false
    }
}

export class Rook extends Piece {
    public character = 't'
    public hasMoved = false

    isValidMove(start: Square, end: Square): boolean {
        return this.squaresAreHorizontal(start, end) || this.squaresAreVertical(start, end)
    }

    executeMove(start: Square, end: Square): void {
        end.piece = start.piece
        start.piece = null

        this.hasMoved = true
    }
}

export class Pawn extends Piece {
    public character = 'o'

    isValidMove(start: Square, end: Square): boolean {
        const horizontallyAdjacent = start.col + 1 === end.col || start.col - 1 === end.col

        if (this.color === 'white') {
            if (horizontallyAdjacent && start.row + 1 === end.row && end.piece) {
                return true
            }
        } else {
            if (horizontallyAdjacent && start.row - 1 === end.row && end.piece) {
                return true
            }
        }

        if (!this.squaresAreVertical(start, end) || end.piece) {
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

    override executeMove(start: Square, end: Square, _game: Game, promotion?: Piece): void {
        if (this.color === 'white' ? end.row === 7 : end.row === 0) {
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
