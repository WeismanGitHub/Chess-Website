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
    export type Response = SocketResponse
    export const Name = 'create-room'
}

export namespace JoinRoom {
    export type Response = SocketResponse<{ opponentName: string }>
    export const Name = 'join-room'
}

export namespace SendMessage {
    export type Response = SocketResponse
    export const Name = 'send-message'
}
