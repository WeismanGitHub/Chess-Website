export type Color = 'black' | 'white'

export type Coordinate = [number, number]

export enum GameState {
    Active,
    Stalemate,
    BlackWin,
    WhiteWin,
    BlackResignation,
    WhiteResignation,
}
