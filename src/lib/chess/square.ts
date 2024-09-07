import { Piece } from './pieces'

export default class Square {
    public piece: Piece | null
    public x: number
    public y: number

    constructor(x: number, y: number, piece: Piece | null = null) {
        this.piece = piece
        this.x = x
        this.y = y
    }
}
