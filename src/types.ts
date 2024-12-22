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

type SocketResponse<data = void> =
    | {
          success: true
          data: data
      }
    | {
          success: false
          error: string
      }

export namespace CreateRoom {
    export type Response = SocketResponse<string>
    export const Name = 'create-room'
}

export namespace JoinRoom {
    export type Response = SocketResponse<{ name: string; id: string }>
    export const Name = 'join-room'
}

export namespace SendMessage {
    export type Response = SocketResponse
    export const Name = 'send-message'
}
