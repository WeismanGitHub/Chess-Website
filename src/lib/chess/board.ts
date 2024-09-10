import Square from './square'

export default class Board {
    private squares: Square[][]

    constructor(squares: Square[][]) {
        this.squares = squares
    }

    getSquare(row: number, col: number): Square | null {
        const square: Square | null = this.squares[row][col]

        return square
    }
}
