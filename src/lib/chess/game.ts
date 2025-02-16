import { Color, GameState } from '../../types'
import { Piece } from './pieces'
import Square from './square'
import Board from './board'

export default class Game {
    public state: GameState = GameState.Active
    public board: Board
    public turn: Color = 'white'

    constructor(board: Board = Board.generate()) {
        this.board = board
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

        if (!piece.isValidMove(start, end, this)) {
            throw new Error('Invalid Move')
        }

        // Reversing the move if King is in check can be more efficient.
        const squares: Square[][] = []

        for (let i = 0; i < 8; i++) {
            squares[i] = []
            for (let j = 0; j < 8; j++) {
                const piece = this.board.squares[i][j].piece

                squares[i][j] = new Square(i, j, piece && Object.create(piece))
            }
        }

        piece.executeMove(start, end, this, promotion)

        if (this.kingInCheck(this.turn)) {
            this.board.squares = squares

            throw new Error('Your King is in check.')
        }

        if (this.kingInCheckmate()) {
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
        const helper = (
            distance: number,
            coordCalculator: (i: number) => [number, number],
            game = this
        ): boolean => {
            for (let i = 0; i < distance; i++) {
                const [row, col] = coordCalculator(i)

                const square = game.board.getSquare(row, col)

                if (!square) {
                    throw new Error(`No square at row ${row}, col ${col}`)
                }

                if (square.piece) {
                    return false
                }
            }

            return true
        }

        if (Game.pathIsVertical(start, end)) {
            return helper(Math.abs(start.row - end.row) - 1, (i) => {
                const row = start.row < end.row ? start.row + i + 1 : end.row - i + 1

                return [row, start.col]
            })
        } else if (Game.pathIsHorizontal(start, end)) {
            return helper(Math.abs(start.col - end.col) - 1, (i) => {
                const col = start.col < end.col ? start.col + i + 1 : end.col - i + 1

                return [start.row, col]
            })
        } else if (Game.pathIsDiagonal(start, end)) {
            const distance = Math.abs(start.col - end.col) - 1

            return helper(distance, (i) => {
                const col = start.col < end.col ? start.col + i + 1 : start.col - i - 1
                const row = start.row < end.row ? start.row + i + 1 : start.row - i - 1

                return [row, col]
            })
        } else {
            throw new Error("Method cannot process paths that aren't diagonal, horizontal, or vertical.")
        }
    }
}
