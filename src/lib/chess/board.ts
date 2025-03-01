import { Bishop, King, Knight, Pawn, Piece, Queen, Rook } from './pieces'
import { Color } from '../../types'
import Square from './square'

type OccupiedSquare = Square & { piece: Piece }

export default class Board {
    public squares: Square[][]

    constructor(squares: Square[][]) {
        this.squares = squares
    }

    getSquare(row: number, col: number): Square | null {
        const square: Square | null = this.squares[row]?.[col] ?? null

        return square
    }

    getOccupiedSquares(color: Color): OccupiedSquare[] {
        return this.squares
            .flat()
            .filter((square) => square.piece && square.piece.color !== color) as OccupiedSquare[]
    }

    getKingSquare(color: Color) {
        for (let i = 0; i < this.squares.length; i++) {
            for (let j = 0; j < this.squares[i].length; j++) {
                const square = this.squares[i][j]
                const piece = square.piece

                if (piece && piece instanceof King && piece.color === color) {
                    return square as Square & { piece: King }
                }
            }
        }

        throw new Error(`Board does not have a ${color} king.`)
    }

    static generate(): Board {
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

        return new Board(rows)
    }

    static deepCopy(board: Board): Board {
        const copiedSquares: Square[][] = []

        for (let i = 0; i < 8; i++) {
            copiedSquares[i] = []

            for (let j = 0; j < 8; j++) {
                const piece = board.squares[i][j].piece

                copiedSquares[i][j] = new Square(i, j, piece && Object.create(piece))
            }
        }

        return new Board(copiedSquares)
    }
}
