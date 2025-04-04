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
    export type Response = SocketResponse
    export const Name = 'join-room'
}

export namespace SendMessage {
    export type Response = SocketResponse
    export const Name = 'send-message'
}

export namespace ReceiveMessage {
    export type Response = string
    export const Name = 'receive-message'
}

export namespace PlayerJoined {
    export type Response = SocketResponse<{ id: string; name: string }>
    export const Name = 'player-joined'
}

export namespace Ready {
    export const Name = 'ready'
}

export namespace MakeMove {
    export const Name = 'make-move'
}
