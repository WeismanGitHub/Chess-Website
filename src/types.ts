export type Color = 'black' | 'white'

export type Coordinate = [number, number]

export enum GameState {
    Active,
    WhiteWin,
    WhiteResignation,
    WhiteAbandon,
    BlackWin,
    BlackResignation,
    BlackAbandon,
    Stalemate,
    ThreefoldRepetition,
    FiftyMove,
}
