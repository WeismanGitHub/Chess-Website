import { Game } from './chess'
import Keyv from 'keyv'

export enum RoomState {
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
    state: RoomState
    game: Game | null
    players: Player[]
    minutes: number
}

export const rooms = new Keyv<Room>({ namespace: 'rooms' })
