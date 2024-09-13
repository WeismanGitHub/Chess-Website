type Color = 'black' | 'white'

type Coordinate = [number, number]

enum GameStatus {
    Active,
    Stalemate,
    BlackWin,
    WhiteWin,
    BlackResignation,
    WhiteResignation,
}
