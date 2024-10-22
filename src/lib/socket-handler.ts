import { lobbies, Lobby, Room, rooms } from './caches'
import CustomError from './custom-error'
import { Clock, Game } from './chess'
import { Socket } from 'socket.io'
import { lobbyJoinSchema, messageSchema } from './zod'

type AuthenticatedSocket = Socket & { userId: string; roomId: string | null }

export default function socketHandler(socket: AuthenticatedSocket) {
    socket.on('createLobby', async (values, callback) => {
        try {
            const { success, data } = lobbyJoinSchema.safeParse(values)

            if (!success) {
                throw new CustomError('Invalid lobby config values.')
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

            socket.roomId = data.name
            socket.join(data.name)

            callback({ success: true, data: data.name })
        } catch (err) {
            callback({
                success: false,
                data: err instanceof CustomError ? err.message : 'A server error occurred.',
            })
        }
    })

    socket.on('joinLobby', async (values, callback) => {
        try {
            const { success, data } = await lobbyJoinSchema.safeParseAsync(values)

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
            socket.to(data.name).emit('playerJoined', socket.userId)
            socket.join(data.name)

            callback({ success: true })
        } catch (err) {
            callback({
                success: false,
                data: err instanceof CustomError ? err.message : 'A server error occurred.',
            })
        }
    })

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

    socket.on('sendMessage', async (values, callback) => {
        try {
            const { success, data } = await messageSchema.safeParseAsync(values)

            if (!success) {
                throw new CustomError('Invalid lobby credentials.')
            }

            if (!socket.roomId) {
                throw new CustomError('Join a lobby first.')
            }

            const lobby = await lobbies.get<Lobby>(socket.roomId)

            if (!lobby) {
                throw new CustomError("That lobby doesn't exist.")
            }

            socket.to(socket.roomId).emit('messageReceived', data)
        } catch (err) {
            callback({
                success: false,
                data: err instanceof CustomError ? err.message : 'A server error occurred.',
            })
        }
    })

    socket.on('disconnect', async () => {
        // delete lobby
    })

    // const game = new GameCacheEntry(new Game(), new Clock(CLOCK_TIME, () => {}), coinflip ? userId : null, !coinflip ? userId : null)

    // await games.set(id.toString(), game)

    // // construct the game. randomly assign the users to black/white
    // // Math.random() < 0.5
}

// goal: website where users can play chess

// flow: a user creates a game on /games. they can invite someone off their friends list to the lobby. once a friend joins and they both click "ready" then a room instance is created.
