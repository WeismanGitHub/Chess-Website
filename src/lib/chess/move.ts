import { Color } from '../../types'
import { Piece } from './pieces'
import Square from './square'

export default class Move {
    public color: Color
    public pieceMoved: Piece
    public pieceKilled: Piece | null

    public start: Square
    public end: Square

    public castlingMove: boolean
    public check: boolean
    public checkmate: boolean

    constructor(
        piece: Piece,
        pieceKilled: Piece | null,
        color: Color,
        start: Square,
        end: Square,
        check: boolean = false,
        castlingMove: boolean = false,
        checkmate: boolean = false
    ) {
        this.color = color
        this.pieceMoved = piece
        this.pieceKilled = pieceKilled

        this.start = start
        this.end = end

        this.castlingMove = castlingMove
        this.check = check
        this.checkmate = checkmate
    }
}
