import { Bishop, King, Knight, Pawn, Piece, Queen, Rook } from './pieces'
import { Color, Coordinate, GameStatus } from '../../types'
import Square from './square'
import Board from './board'
import Move from './move'

export default class Game {
    public status: GameStatus = GameStatus.Active
    public board: Board
    public deadPieces: Piece[] = []
    public moves: Move[] = []
    private turn: Color = 'white'

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
            rows[6][i].piece = new Pawn('black')
        }

        this.board = new Board(rows)
    }

    movePiece(startCoordinate: Coordinate, endCoordinate: Coordinate, promotion: Piece | null) {
        if (this.status !== GameStatus.Active) {
            throw new Error('Game is not active.')
        }

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

        if (!piece.canMove(this.board, start, end)) {
            throw new Error('Invalid Move')
        }

        let killedPiece: Piece | null = null

        if (end.piece) {
            killedPiece = end.piece
            this.deadPieces.push(end.piece)
        }

        switch (true) {
            case piece instanceof Pawn:
                if (end.row === this.board.rows) {
                    end.piece = promotion
                    start.piece = null
                }

                break

            default:
                end.piece = piece
                start.piece = null
                break
        }

        this.moves.push(new Move(piece, killedPiece, this.turn, start, end))
        this.turn = this.turn === 'white' ? 'black' : 'white'
    }

    end(status: GameStatus) {
        if (status === GameStatus.Active) {
            throw new Error('Active is an invalid status.')
        }

        this.status = status
    }
}
