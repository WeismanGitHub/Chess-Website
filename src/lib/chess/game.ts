import { King, Pawn, Piece, Rook } from './pieces'
import { Color, GameState } from '../../types'
import { Square, Board } from './'

export default class Game {
    public state: GameState = GameState.Active
    public board: Board
    public turn: Color = 'white'

    private snapshots: Map<string, number> = new Map()
    public previousBoards: Board[] = []
    public previousPieces: Piece[] = []
    private fiftyMoveDrawCounter = 0

    constructor(board: Board = Board.generate()) {
        this.board = board
        this.previousBoards.push(Board.deepCopy(board))
    }

    kingInCheck(color: Color): boolean {
        const kingSquare = this.board.getKingSquare(color)

        for (const square of this.board.getOccupiedSquares(color)) {
            if (square.piece.isValidMove(square, kingSquare, this)) {
                return true
            }
        }

        return false
    }

    kingInCheckmate(color: Color): boolean {
        if (!this.kingInCheck(color)) {
            return false
        }

        const squares = this.board.squares
            .flat()
            .filter((square) => square.piece && square.piece.color !== color) as (Square & {
            piece: Piece
        })[]

        for (const square of squares) {
            const validMoves = square.piece.getValidMoves(square, this)

            if (validMoves.length) {
                return false
            }
        }

        return true
    }

    isStalemate(): boolean {
        return false
    }

    isFiftyMove(): boolean {
        return this.fiftyMoveDrawCounter >= 100
    }

    createSnapshot(): string {
        const board = this.board

        return board.squares.flat().reduce((snapshot, square) => {
            let character = square.piece?.character || '.'

            if (square.piece) {
                if (square.piece.character === 'white') {
                    character = character.toUpperCase()
                }

                if (square.piece instanceof King) {
                    const kingSideRookSquare = board.getSquare(square.row, 0)
                    const queenSideRookSquare = board.getSquare(square.row, 7)

                    if (
                        kingSideRookSquare &&
                        kingSideRookSquare.piece instanceof Rook &&
                        !kingSideRookSquare.piece.hasMoved
                    ) {
                        character += '-'
                    }

                    if (
                        queenSideRookSquare &&
                        queenSideRookSquare.piece instanceof Rook &&
                        !queenSideRookSquare.piece.hasMoved
                    ) {
                        character += '_'
                    }
                } else if (square.piece instanceof Pawn) {
                    // record en passant
                }
            }

            return snapshot + character
        }, '')
    }

    undoHalfMove(): void {
        const length = this.previousBoards.length

        if (length <= 1) {
            return
        }

        const color = length % 2 === 0 ? 'white' : 'black'
        this.turn = color

        this.board = Board.deepCopy(this.previousBoards[length - 2])
        this.previousPieces.pop()
        this.previousBoards.pop()

        this.state = GameState.Active
    }

    makeMove(start: Square, end: Square, promotion?: Piece) {
        if (this.state !== GameState.Active) {
            throw new Error('Game is not active.')
        }

        const opponentColor = this.turn === 'white' ? 'black' : 'white'

        const isEnPassant = Pawn.isEnPassant(start, end, this)
        const piece = start.piece
        const captured = isEnPassant ? new Pawn(opponentColor) : end.piece

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

        piece.executeMove(start, end, this, promotion)

        if (this.kingInCheck(this.turn)) {
            this.board = Board.deepCopy(this.previousBoards[this.previousBoards.length - 1])

            throw new Error('Your King is in check.')
        }

        if (this.kingInCheckmate(opponentColor)) {
            this.state = this.turn === 'white' ? GameState.WhiteWin : GameState.BlackWin
        }

        const snapshot = this.createSnapshot()
        const count = this.snapshots.get(snapshot) ?? 0
        this.snapshots.set(snapshot, count + 1)

        if (piece instanceof Pawn || captured) {
            this.fiftyMoveDrawCounter = 0
        } else {
            this.fiftyMoveDrawCounter++
        }

        this.previousPieces.push(piece)
        this.previousBoards.push(Board.deepCopy(this.board))

        if (count >= 2) {
            this.state = GameState.ThreefoldRepetition
        } else if (this.isFiftyMove()) {
            this.state = GameState.FiftyMove
        } else if (this.isStalemate()) {
            this.state = GameState.Stalemate
        }

        this.turn = opponentColor
    }
}
