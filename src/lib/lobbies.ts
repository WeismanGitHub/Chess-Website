import Keyv from 'keyv'

export const lobbies = new Keyv({ namespace: 'lobbies' })

export type Lobby = {
    players: { id: string; ready: boolean }[]
}
