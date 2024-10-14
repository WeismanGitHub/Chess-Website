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
}
