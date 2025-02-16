import { Color } from '../../types'
import { King } from './pieces'
import Square from './square'

export default class Board {
    public squares: Square[][]

    constructor(squares: Square[][]) {
        this.squares = squares
    }

    getSquare(row: number, col: number): Square | null {
        const square: Square | null = this.squares[row]?.[col] ?? null

        return square
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
}
