import { Color } from '../../types'
import { Piece } from './pieces'
import Square from './square'

export default class HalfMove {
    public start: Square
    public end: Square

    public piece: Piece
    public captured: Piece | null
    public promotion: Piece | null

    public color: Color

    constructor(
        color: Color,
        start: Square,
        end: Square,
        piece: Piece,
        captured: Piece | null = null,
        promotion: Piece | null = null
    ) {
        this.start = start
        this.end = end

        this.piece = piece
        this.captured = captured
        this.promotion = promotion

        this.color = color
    }
}
