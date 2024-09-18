import { Clock, Game } from './chess'
import Keyv from 'keyv'

export const lobbies = new Keyv({ namespace: 'lobbies' })

export type Lobby = {
    players: { id: string; ready: boolean }[]
}

export const rooms = new Keyv({ namespace: 'rooms' })

export type Room = {
    white: string
    black: string
    game: Game
    clock: Clock
}
