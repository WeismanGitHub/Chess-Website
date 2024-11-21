import { lobbies, Lobby, Room, rooms } from './caches'
import { lobbyJoinSchema, messageSchema } from './zod'
import { Clock, Game } from './chess'
import { Socket } from 'socket.io'
import CustomError from './custom-error'

type AuthenticatedSocket = Socket & { userId: string; roomId: string | null }

type SocketResponse<data = void> =
    | {
          success: true
          data: data
      }
    | {
          success: false
          error: string
      }

export type CreateLobbyResponse = SocketResponse
export type JoinLobbyResponse = SocketResponse<{ opponentName: string }>
export type SendMessageResponse = SocketResponse

function errorHandler(
    listener: (data: any, callback: Function) => Promise<void>
): (data: any, callback: Function) => Promise<void> {
    return async function (data: any, callback: Function) {
        try {
            const res = await listener(data, callback)

            callback({ success: true, data: res })
        } catch (err) {
            callback({
                success: false,
                error: err instanceof CustomError ? err.message : 'A server error occurred.',
            })
        }
    }
}

export default function socketHandler(socket: AuthenticatedSocket) {
    socket.on(
        'create lobby',
        errorHandler(async (body) => {
            const { success, data } = lobbyJoinSchema.safeParse(body)

            if (!success) {
                throw new CustomError('Invalid lobby configuration values.')
            }

            if (await lobbies.has(data.name)) {
                throw new CustomError('Please use a unique lobby name.')
            }

            await lobbies.set(data.name, {
                name: data.name,
                password: data.password,
                minutes: data.password,
                started: false,
                players: [
                    {
                        id: socket.userId,
                        ready: false,
                    },
                ],
            })
        })
    )

    socket.on(
        'join lobby',
        errorHandler(async (body) => {
            const { success, data } = await lobbyJoinSchema.safeParseAsync(body)

            if (!success) {
                throw new CustomError('Invalid lobby credentials.')
            }

            const lobby = await lobbies.get<Lobby>(data.name)

            if (!lobby) {
                throw new CustomError("That lobby doesn't exist.")
            }

            if (lobby.password !== data.password) {
                throw new CustomError('That password is invalid.')
            }

            if (lobby.players.length === 2) {
                throw new CustomError('Lobby is full.')
            }

            if (socket.rooms.has(data.name)) {
                throw new CustomError('You are already in this lobby.')
            }

            lobby.players.push({ id: socket.userId, ready: false })

            await lobbies.set(data.name, lobby)

            socket.roomId = data.name
            socket.to(data.name).emit('player joined', socket.userId)
            socket.join(data.name)
        })
    )

    socket.on('ready', async () => {
        if (!socket.roomId) {
            throw new CustomError('Join a lobby first.')
        }

        const lobby = await lobbies.get<Lobby>(socket.roomId)

        if (!lobby) {
            throw new CustomError("That lobby doesn't exist.")
        }

        if (lobby.players.length < 2) {
            throw new CustomError('You need 2 players to start.')
        }

        if (!lobby.players.some((player) => player.id == socket.userId)) {
            throw new CustomError('You are not in this lobby.')
        }

        lobby.players = lobby.players.map((player) => {
            if (player.id === socket.userId) {
                player.ready = true
            }

            return player
        })

        // If both players are NOT ready
        if (!(lobby.players[0].ready && lobby.players[1].ready)) {
            lobbies.set(socket.roomId, lobby)
            return
        }

        lobbies.delete(socket.roomId)

        const coinflip = Math.random() < 0.5

        const room: Room = {
            white: lobby.players[coinflip ? 1 : 0].id,
            black: lobby.players[coinflip ? 0 : 1].id,

            clock: new Clock(lobby.minutes, () => {}),
            game: new Game(),
        }

        rooms.set(socket.roomId, room)

        // create the game room
    })

    socket.on('move', async () => {
        if (!socket.roomId) {
            throw new CustomError("You're not in a room.")
        }

        const room = rooms.get(socket.roomId)

        if (!room) {
            throw new CustomError('Could not find your room.')
        }
    })

    socket.on(
        'send message',
        errorHandler(async (body) => {
            console.log(body)
            const { success, data } = await messageSchema.safeParseAsync(body)

            if (!success) {
                throw new CustomError('That message is invalid.')
            }

            if (!socket.roomId) {
                throw new CustomError('Join a lobby first.')
            }

            const lobby = await lobbies.get<Lobby>(socket.roomId)

            // if (!lobby) {
            //     throw new CustomError("That lobby doesn't exist.")
            // }

            console.log(data, lobby)

            // socket.to(socket.roomId).emit('message received', data)
        })
    )

    socket.on('disconnect', async () => {
        // delete lobby
    })

    // const game = new GameCacheEntry(new Game(), new Clock(CLOCK_TIME, () => {}), coinflip ? userId : null, !coinflip ? userId : null)

    // await games.set(id.toString(), game)

    // // construct the game. randomly assign the users to black/white
    // // Math.random() < 0.5
}

// Flow: User goes to /games and creates a lobby. There will be a widget that shows their name, whether they're ready or not, and how much time they have on the clock. Once the second user joins, the blank opponent widget will be filled in. Once both users have clicked ready, the game begins. Once the game ends, the overlay is changed and the players are asked if they want a rematch.

// Notes: Have a semi transparent gray overlay on the board and a slightly red background to the user widgets until the game begins. Once it begins, have it flash green then go to a neutral color. Display the state of the game with an overlay. Make the overlay red/green depending on who won, and add a rematch button or something. Maybe add a button to show and hide the overlay once the game is over so you can walk through the game.
