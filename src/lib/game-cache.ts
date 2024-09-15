import Keyv from 'keyv'
import { Clock, Game } from './chess'
import { Types } from 'mongoose'

export const games = new Keyv()

export class GameCacheEntry {
    public game: Game
    public clock: Clock
    public white: Types.ObjectId | null
    public black: Types.ObjectId | null

    constructor(game: Game, clock: Clock, white: Types.ObjectId | null, black: Types.ObjectId | null) {
        this.game = game
        this.clock = clock
        this.white = white
        this.black = black
    }
}
