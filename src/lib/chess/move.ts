export default class Move {
    public white: boolean
    public isCastlingMove: boolean

    constructor(white: boolean, isCastlingMove = false) {
        this.white = white
        this.isCastlingMove = isCastlingMove
    }
}
