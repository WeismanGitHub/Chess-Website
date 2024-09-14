import { Game } from './lib/chess/game'
import Clock from './lib/chess/clock'

declare global {
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
}
