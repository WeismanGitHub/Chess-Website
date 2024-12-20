import { Color } from '../../types'
import { King } from './pieces'
import Square from './square'

export default class Board {
    public squares: Square[][]
    public rows: number

    constructor(squares: Square[][]) {
        this.squares = squares
        this.rows = squares.length
    }

    getSquare(row: number, col: number): Square | null {
        const square: Square | null = this.squares[row][col]

        return square
    }

    getKingSquare(color: Color): Square {
        for (let i = 0; i < this.squares.length; i++) {
            for (let j = 0; j < this.squares[i].length; j++) {
                const square = this.squares[i][j]
                const piece = square.piece

                if (piece && piece instanceof King && piece.color === color) {
                    return square
                }
            }
        }

        throw new Error(`Board does not have a ${color} king.`)
    }
}
