import { Piece } from './pieces'
import Board from './board'
import Move from './move'

export class Game {
    private board: Board
    public pieces: Piece[]
    public moves: Move[] = []
    private isWhitesTurn: boolean = true

    constructor(board: Board, pieces: Piece[]) {
        this.board = board
        this.pieces = pieces
    }

    movePiece(piece: Piece, x: number, y: number) {
        const square = this.board.getSquare(x, y)

        if (!square) {
            throw new Error('Could not find that square.')
        }

        this.moves.push(new Move(this.isWhitesTurn))

        this.isWhitesTurn = !this.isWhitesTurn
    }
}

export class GameBuilder {
    static initializeGame() {}
}
