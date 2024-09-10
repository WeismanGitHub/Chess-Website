import { Bishop, King, Knight, Pawn, Queen, Rook } from './pieces'
import Square from './square'
import Board from './board'
import Move from './move'

enum GameStatus {
    Active,
    Win,
    Stalemate,
    Resignation,
}

export class Game {
    public board: Board

    public moves: Move[] = []
    private turn: Color = 'white'

    public status: GameStatus = GameStatus.Active
    public winner: Color | null = null

    constructor(board: Board) {
        this.board = board
    }

    movePiece(startCoordinate: Coordinate, endCoordinate: Coordinate) {
        const start = this.board.getSquare(startCoordinate[0], startCoordinate[1])
        const end = this.board.getSquare(endCoordinate[0], endCoordinate[1])

        if (!start || !end) {
            throw new Error('Invalid Coordinate(s)')
        }

        const piece = start.piece

        if (!piece) {
            throw new Error("There's no piece on that square.")
        }

        if (piece.color !== this.turn) {
            throw new Error('Cannot move pieces of another color.')
        }

        if (piece.canMove(this.board, start, end)) {
            // move
        }

        // const move = new Move()
        // this.moves.push(move)

        this.turn = this.turn === 'white' ? 'black' : 'white'
    }
}

export abstract class GameBuilder {
    static createDefaultBoard() {
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
        rows[0][3].piece = new Queen()
        rows[0][4].piece = new King()
        rows[0][5].piece = new Bishop()
        rows[0][6].piece = new Knight()
        rows[0][7].piece = new Rook()

        for (let i = 0; i < 8; i++) {
            rows[1][i].piece = new Pawn()
        }

        rows[7][0].piece = new Rook('black')
        rows[7][1].piece = new Knight('black')
        rows[7][2].piece = new Bishop('black')
        rows[7][3].piece = new Queen('black')
        rows[7][4].piece = new King('black')
        rows[7][5].piece = new Bishop('black')
        rows[7][6].piece = new Knight('black')
        rows[7][7].piece = new Rook('black')

        for (let i = 0; i < 8; i++) {
            rows[1][i].piece = new Pawn()
        }

        return new Board(rows)
    }
}
