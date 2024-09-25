import { lobbies, Lobby, Room, rooms } from './caches'
import { Socket } from 'socket.io'
import { Types } from 'mongoose'
import { Clock, Game } from './chess'
// import { games, GameCacheEntry } from './game-cache'
// import Game from './chess/game'
// import Clock from './chess/clock'

const CLOCK_TIME = 30_000

type AuthenticatedSocket = Socket & { userId: string; roomId: string | null }

export default function socketHandler(socket: AuthenticatedSocket) {
    socket.on('createLobby', async (callback) => {
        const lobbyId = new Types.ObjectId().toString()

        await lobbies.set(lobbyId, {
            players: [{ id: socket.userId, ready: false }],
            started: false,
        })

        socket.roomId = lobbyId
        socket.join(lobbyId)
        callback(lobbyId)
    })

    socket.on('joinLobby', async (id: string) => {
        if (!Types.ObjectId.isValid(id)) {
            throw new Error('Please use a valid game id.')
        }

        const lobby = await lobbies.get<Lobby>(id)

        if (!lobby) {
            throw new Error("That lobby doesn't exist.")
        }

        if (lobby.players.length === 2) {
            throw new Error('Lobby is full.')
        }

        if (socket.rooms.has(id)) {
            throw new Error('You are already in this lobby.')
        }

        lobby.players.push({ id: socket.userId, ready: false })

        await lobbies.set(id, lobby)

        socket.roomId = id
        socket.to(id).emit('playerJoined', socket.userId)
        socket.join(id)
    })

    socket.on('ready', async () => {
        if (!socket.roomId) {
            throw new Error('Join a lobby first.')
        }

        const lobby = await lobbies.get<Lobby>(socket.roomId)

        if (!lobby) {
            throw new Error("That lobby doesn't exist.")
        }

        if (lobby.players.length < 2) {
            throw new Error('You need 2 players to start.')
        }

        if (!lobby.players.some((player) => player.id == socket.userId)) {
            throw new Error('You are not in this lobby.')
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

            clock: new Clock(CLOCK_TIME, () => {}),
            game: new Game(),
        }

        rooms.set(socket.roomId, room)

        // create the game room
    })

    socket.on('move', async () => {
        if (!socket.roomId) {
            throw new Error("You're not in a room.")
        }

        const room = rooms.get(socket.roomId)

        if (!room) {
            throw new Error('Could not find your room.')
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
