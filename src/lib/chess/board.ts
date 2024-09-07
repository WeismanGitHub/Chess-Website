import Square from './square'

export default class Board {
    private squares: Square[][]

    constructor(squares: Square[][]) {
        this.squares = squares
    }

    getSquare(x: number, y: number): Square | null {
        const square: Square | null = this.squares[x][y]

        return square
    }
}
