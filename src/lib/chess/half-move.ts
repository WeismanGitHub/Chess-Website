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

    public isEnPassant: boolean
    public isCastling: boolean
    public isPromotion: boolean

    constructor(
        color: Color,
        start: Square,
        end: Square,
        piece: Piece,
        isEnPassant: boolean,
        isCastling: boolean,
        isPromotion: boolean,
        captured: Piece | null = null,
        promotion: Piece | null = null
    ) {
        this.start = start
        this.end = end

        this.piece = piece
        this.captured = captured
        this.promotion = promotion

        this.color = color

        this.isEnPassant = isEnPassant
        this.isCastling = isCastling
        this.isPromotion = isPromotion
    }
}
