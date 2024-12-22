import { Game } from './chess'
import Keyv from 'keyv'

enum RoomState {
    Setup,
    Active,
    Done,
}

type Player = {
    id: string
    name: string
    ready: boolean
}

export interface Room {
    id: string
    state: RoomState
    game: Game | null
    players: Player[]
}

export const rooms = new Keyv({ namespace: 'rooms' })
