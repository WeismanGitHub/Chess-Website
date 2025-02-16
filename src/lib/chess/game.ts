import { Bishop, King, Knight, Pawn, Piece, Queen, Rook } from './pieces'
import { Color, GameState } from '../../types'
import Square from './square'
import Board from './board'

export default class Game {
    public state: GameState = GameState.Active
    public board: Board
    public turn: Color = 'white'

    constructor() {
        const rows = []

        for (let i = 0; i < 8; i++) {
            const row: Square[] = []

            for (let j = 0; j < 8; j++) {
                row.push(new Square(i, j))
            }

            rows.push(row)
        }

        rows[0][0].piece = new Rook()
        rows[0][1].piece = new Knight()
        rows[0][2].piece = new Bishop()
        rows[0][3].piece = new King()
        rows[0][4].piece = new Queen()
        rows[0][5].piece = new Bishop()
        rows[0][6].piece = new Knight()
        rows[0][7].piece = new Rook()

        for (let i = 0; i < 8; i++) {
            rows[1][i].piece = new Pawn()
        }

        rows[7][0].piece = new Rook('black')
        rows[7][1].piece = new Knight('black')
        rows[7][2].piece = new Bishop('black')
        rows[7][3].piece = new King('black')
        rows[7][4].piece = new Queen('black')
        rows[7][5].piece = new Bishop('black')
        rows[7][6].piece = new Knight('black')
        rows[7][7].piece = new Rook('black')

        for (let i = 0; i < 8; i++) {
            rows[6][i].piece = new Pawn('black')
        }

        this.board = new Board(rows)
    }

    static pathIsDiagonal(start: Square, end: Square): boolean {
        return Math.abs(start.col - end.col) === Math.abs(start.row - end.row)
    }

    static pathIsVertical(start: Square, end: Square): boolean {
        return start.col === end.col
    }

    static pathIsHorizontal(start: Square, end: Square): boolean {
        return start.row === end.row
    }

    kingInCheck(color: Color): boolean {
        const opponentSquares = this.board.squares
            .flat()
            .filter((square) => square.piece && square.piece.color !== color) as (Square & {
            piece: Piece
        })[]

        const kingSquare = this.board.getKingSquare(color)

        for (const square of opponentSquares) {
            if (square.piece.isValidMove(square, kingSquare, this)) {
                return true
            }
        }

        return false
    }

    kingInCheckmate(): boolean {
        return false
    }

    makeMove(start: Square, end: Square, promotion?: Piece) {
        if (this.state !== GameState.Active) {
            throw new Error('Game is not active.')
        }

        const piece = start.piece

        if (!piece) {
            throw new Error("There's no piece on that square.")
        }

        if (piece.color !== this.turn) {
            throw new Error(`Cannot move a ${piece.color} piece on ${this.turn}'s turn.`)
        }

        if (end.piece?.color === this.turn) {
            throw new Error('Cannot take your own piece.')
        }

        const king = this.board.getKingSquare(this.turn).piece

        if (king.isInCheck(this)) {
            throw new Error('Your king is in check.')
        }

        if (!piece.isValidMove(start, end, this)) {
            throw new Error('Invalid Move')
        }

        // Reversing the move if King is in check can be more efficient.
        const squares = this.board.squares.map((row) => row.slice())

        piece.executeMove(start, end, this, promotion)

        if (this.board.getKingSquare(this.turn).piece.isInCheck(this)) {
            this.board.squares = squares
        }

        const opposingKing = this.board.getKingSquare(this.turn === 'black' ? 'white' : 'black')?.piece

        if (opposingKing.IsInCheckmate(this)) {
            this.state = this.turn === 'black' ? GameState.BlackWin : GameState.WhiteWin
        }

        this.turn = this.turn == 'white' ? 'black' : 'white'
    }

    end(status: GameState) {
        if (status === GameState.Active) {
            throw new Error('Active is an invalid status.')
        }

        this.state = status
    }

    pathIsClear(start: Square, end: Square): boolean {
        // similar steps in each branch. you can prob simplify

        if (Game.pathIsVertical(start, end)) {
            const distance = Math.abs(start.row - end.row) - 1

            for (let i = 0; i < distance; i++) {
                const row = start.row < end.row ? start.row + i + 1 : end.row - i + 1

                const square = this.board.getSquare(row, start.col)

                if (!square) {
                    throw new Error(`No square at row ${row}, col ${start.col}`)
                }

                if (square.piece) {
                    return false
                }
            }
        } else if (Game.pathIsHorizontal(start, end)) {
            const distance = Math.abs(start.col - end.col) - 1

            for (let i = 0; i < distance; i++) {
                const col = start.col < end.col ? start.col + i + 1 : end.col - i + 1

                const square = this.board.getSquare(start.row, col)

                if (!square) {
                    throw new Error(`No square at row ${start.row}, col ${col}`)
                }

                if (square.piece) {
                    return false
                }
            }
        } else if (Game.pathIsDiagonal(start, end)) {
            return true
        } else {
            throw new Error("Method cannot process paths that aren't diagonal, horizontal, or vertical.")
        }

        return true
    }
}
