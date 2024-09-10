import { Piece } from './pieces'

export default class Square {
    public piece: Piece | null
    public row: number
    public col: number

    constructor(row: number, col: number, piece: Piece | null = null) {
        this.piece = piece
        this.row = row
        this.col = col
    }
}
