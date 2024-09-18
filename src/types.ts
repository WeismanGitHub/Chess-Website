export type Color = 'black' | 'white'

export type Coordinate = [number, number]

export enum GameStatus {
    Active,
    Stalemate,
    BlackWin,
    WhiteWin,
    BlackResignation,
    WhiteResignation,
}
