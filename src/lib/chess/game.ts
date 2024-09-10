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

    constructor() {
        this.board = new Board([])
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

        // this.moves.push(new Move(this.turn))

        this.turn = this.turn === 'white' ? 'black' : 'white'
    }
}
