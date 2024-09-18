import { lobbies, Lobby } from './lobbies'
import { Socket } from 'socket.io'
import { Types } from 'mongoose'
// import { games, GameCacheEntry } from './game-cache'
// import Game from './chess/game'
// import Clock from './chess/clock'

// const CLOCK_TIME = 30_000

type AuthenticatedSocket = Socket & { userId: string }

export default function socketHandler(socket: AuthenticatedSocket) {
    socket.on('createLobby', async (callback) => {
        const lobbyId = new Types.ObjectId()

        await lobbies.set(lobbyId.toString(), {
            players: [{ id: socket.userId, ready: false }],
            started: false,
        })

        socket.join(lobbyId.toString())
        callback(lobbyId.toString())
    })

    socket.on('joinLobby', async (id: string) => {
        console.log(id)
        if (!Types.ObjectId.isValid(id)) {
            throw new Error('Please use a valid game id.')
        }

        const lobby = await lobbies.get<Lobby>(id)

        if (!lobby) {
            throw new Error("That lobby doesn't exist.")
        }

        if (lobby?.players.length === 2) {
            throw new Error('Lobby is full.')
        }

        if (lobby.players.some((player) => player.id == socket.userId)) {
            throw new Error('You are already in this lobby.')
        }

        lobby.players.push({ id: socket.userId, ready: false })

        await lobbies.set(id, lobby)

        socket.join(id)
        socket.to(id).emit('playerJoined', socket.userId)
    })

    socket.on('ready', () => {})

    socket.on('disconnect', async () => {
        // delete room
    })

    // const coinflip = Math.random() < 0.5

    // const game = new GameCacheEntry(new Game(), new Clock(CLOCK_TIME, () => {}), coinflip ? userId : null, !coinflip ? userId : null)

    // await games.set(id.toString(), game)

    // // construct the game. randomly assign the users to black/white
    // // Math.random() < 0.5
}

// goal: website where users can play chess

// a signed in user connects to the socketHandler (i need to check if theyre authenticated).

// create the game in memory and store it in a cache by id. once the game is over you delete it from memory and save it in mongodb
