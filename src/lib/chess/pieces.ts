import PathUtils from './path-utils'
import { Color } from '../../types'
import Move from './move'
import Square from './square'
import Game from './game'

function clearPathCheck(_target: Object, _propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.value

    descriptor.value = function (start: Square, end: Square, game: Game): boolean {
        // game.pathIsClear is last because I need isValidMove to catch if a move isn't horizontal, diagonal, or vertical beforehand.
        return originalMethod.apply(this, [start, end, game]) && PathUtils.isClear(game.board, start, end)
    }

    return descriptor
}

export abstract class Piece {
    public color: Color
    abstract character: string // It will look different with the custom font.

    constructor(color: Color = 'white') {
        this.color = color
    }

    abstract isValidMove(start: Square, end: Square, game: Game): boolean
    abstract getValidMoves(start: Square, game: Game): Square[]

    executeMove(start: Square, end: Square, _game: Game, _promotion?: Piece): Move {
        const piece = start.piece

        if (!piece) {
            throw new Error("There's no piece on that square.")
        }

        const captured = end.piece

        end.piece = start.piece
        start.piece = null

        return new Move(this.color, start, end, this, false, false, false, captured, null)
    }
}

export class King extends Piece {
    public character = 'l'
    private hasMoved = false

    private static isCastlingMove(start: Square, end: Square): boolean {
        return start.row === end.row && Math.abs(start.col - end.col) === 2
    }

    isValidMove(start: Square, end: Square, game: Game): boolean {
        if (Math.abs(start.col - end.col) <= 1 && Math.abs(start.row - end.row) <= 1) {
            return true
        }

        if (!King.isCastlingMove(start, end)) {
            return false
        }

        if (game.kingInCheck(this.color)) {
            return false
        }

        if (this.hasMoved) {
            return false
        }

        const isKingSide = start.col > end.col

        const rook = game.board.getSquare(start.row, isKingSide ? 0 : 7)?.piece

        if (!rook || !(rook instanceof Rook) || rook.color !== this.color || rook.hasMoved) {
            return false
        }

        const middleCols = isKingSide ? [start.col - 1, start.col - 2] : [start.col + 1, start.col + 2]

        const king = start.piece
        start.piece = null

        for (const col of middleCols) {
            const middleSquare = game.board.getSquare(start.row, col)

            if (!middleSquare || middleSquare.piece) {
                return false
            }

            middleSquare.piece = king

            if (game.kingInCheck(this.color)) {
                start.piece = king
                middleSquare.piece = null

                return false
            }

            middleSquare.piece = null
        }

        start.piece = king

        return true
    }

    getValidMoves(start: Square, game: Game): Square[] {
        start
        game
        return []
    }

    override executeMove(start: Square, end: Square, game: Game) {
        const captured = end.piece
        const isCastling = King.isCastlingMove(start, end)

        end.piece = start.piece
        start.piece = null

        if (isCastling) {
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

        return new Move(this.color, start, end, this, false, isCastling, false, captured, null)
    }
}

export class Queen extends Piece {
    public character = 'w'

    @clearPathCheck
    isValidMove(start: Square, end: Square): boolean {
        return (
            PathUtils.isDiagonal(start, end) ||
            PathUtils.isHorizontal(start, end) ||
            PathUtils.isVertical(start, end)
        )
    }

    getValidMoves(start: Square, game: Game): Square[] {
        start
        game
        return []
    }
}

export class Bishop extends Piece {
    public character = 'v'

    @clearPathCheck
    isValidMove(start: Square, end: Square): boolean {
        return PathUtils.isDiagonal(start, end)
    }

    getValidMoves(start: Square, game: Game): Square[] {
        start
        game
        return []
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

    getValidMoves(start: Square, game: Game): Square[] {
        start
        game
        return []
    }
}

export class Rook extends Piece {
    public character = 't'
    public hasMoved = false

    @clearPathCheck
    isValidMove(start: Square, end: Square): boolean {
        return PathUtils.isHorizontal(start, end) || PathUtils.isVertical(start, end)
    }

    override executeMove(start: Square, end: Square) {
        const captured = end.piece

        end.piece = start.piece
        start.piece = null

        this.hasMoved = true

        return new Move(this.color, start, end, this, false, false, false, captured, null)
    }

    getValidMoves(start: Square, game: Game): Square[] {
        start
        game
        return []
    }
}

// en passant
export class Pawn extends Piece {
    public character = 'o'

    private static isEnPassantMove(start: Square, end: Square, game: Game): boolean {
        const piece = start.piece

        if (!piece) {
            throw new Error('Starting square does not have a piece.')
        } else if (!(piece instanceof Pawn)) {
            throw new Error('Piece is not a pawn.')
        }

        const horizontallyAdjacent = start.col + 1 === end.col || start.col - 1 === end.col

        if (!horizontallyAdjacent) {
            return false
        }

        if (piece.color === 'white') {
            if (end.row !== 5) {
                return false
            }
        } else {
            if (end.row !== 2) {
                return false
            }
        }

        const opponentSquare = game.board.getSquare(start.row, end.col)

        if (!opponentSquare || !opponentSquare.piece || !(opponentSquare.piece instanceof Pawn)) {
            return false
        }

        return true
    }

    @clearPathCheck
    isValidMove(start: Square, end: Square, game: Game): boolean {
        const horizontallyAdjacent = start.col + 1 === end.col || start.col - 1 === end.col

        if (horizontallyAdjacent) {
            if (!end.piece) {
                return false
            }

            if (this.color === 'white') {
                return start.row + 1 === end.row
            } else {
                return start.row - 1 === end.row
            }
        }

        if (Pawn.isEnPassantMove(start, end, game)) {
            const previousMove: Move | undefined = game.moves[game.moves.length - 1]

            if (
                !previousMove ||
                !(previousMove.piece instanceof Pawn) ||
                previousMove.end.row !== start.row ||
                previousMove.end.col !== end.col
            ) {
                return false
            }

            return true
        }

        if (!PathUtils.isVertical(start, end) || end.piece) {
            return false
        }

        if (this.color === 'white') {
            // If pawn hasn't moved
            if (start.row === 1) {
                return start.row + 1 === end.row || start.row + 2 === end.row
            }

            return start.row + 1 === end.row
        } else {
            // If pawn hasn't moved
            if (start.row === 6) {
                return start.row - 1 === end.row || start.row - 2 === end.row
            }

            return start.row - 1 === end.row
        }
    }

    getValidMoves(start: Square, game: Game): Square[] {
        start
        game
        return []
    }

    override executeMove(start: Square, end: Square, game: Game, promotion?: Piece) {
        const isPromotion = this.color === 'white' ? end.row === 7 : end.row === 0
        const isEnPassant = Pawn.isEnPassantMove(start, end, game)

        let captured = end.piece
        end.piece = start.piece

        if (isPromotion) {
            if (!promotion) {
                throw new Error('Promotion piece is required.')
            }

            end.piece = promotion
        } else if (isEnPassant) {
            const opponentSquare = game.board.getSquare(start.row, end.col)!

            captured = opponentSquare.piece
        }

        start.piece = null

        return new Move(this.color, start, end, this, isEnPassant, false, isPromotion, captured, promotion)
    }
}
