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

    isCastlingMove(start: Square, end: Square): boolean {
        return start.row === end.row && Math.abs(start.col - end.col) === 2
    }

    isInCheck(game: Game): boolean {
        const opponentSquares = game.board.squares
            .flat()
            .filter((square) => square.piece && square.piece.color !== game.turn) as (Square & {
            piece: Piece
        })[]

        const kingSquare = game.board.getKingSquare(game.turn)

        for (const square of opponentSquares) {
            if (square.piece.isValidMove(square, kingSquare, game)) {
                return true
            }
        }

        return false
    }

    IsInCheckmate(_game: Game): boolean {
        return false
    }

    isValidMove(start: Square, end: Square, game: Game): boolean {
        if (Math.abs(start.col - end.col) <= 1 && Math.abs(start.row - end.row) <= 1) {
            return true
        }

        if (!this.isCastlingMove(start, end)) {
            return false
        }

        if (this.hasMoved) {
            return false
        }

        const isKingSide = start.col < end.col

        const rook = game.board.getSquare(start.row, isKingSide ? 7 : 0)?.piece

        if (!rook || !(rook instanceof Rook) || rook.hasMoved) {
            return false
        }

        const middleCols = isKingSide ? [start.col + 1, start.col + 2] : [start.col - 1, start.col - 2]

        for (const col of middleCols) {
            const middleSquare = game.board.getSquare(start.row, col)

            if (!middleSquare || middleSquare.piece) {
                return false
            }

            middleSquare.piece = start.piece
            start.piece = null

            if (this.isInCheck(game)) {
                start.piece = middleSquare.piece
                middleSquare.piece = null

                return false
            }
        }

        return true
    }

    override executeMove(start: Square, end: Square, game: Game): void {
        end.piece = start.piece
        start.piece = null

        if (this.isCastlingMove(start, end)) {
            const isKingSide = start.col < end.col

            const rookStart = game.board.getSquare(start.row, isKingSide ? 7 : 0)
            const rookEnd = game.board.getSquare(start.row, isKingSide ? start.col + 1 : start.col - 1)

            if (!rookStart || !rookStart.piece || !(rookStart.piece instanceof Rook) || !rookEnd) {
                throw new Error('Could not castle due to error involving rook.')
            }

            rookEnd.piece = rookStart.piece
            rookStart.piece = null
        }

        this.hasMoved = true
    }
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
