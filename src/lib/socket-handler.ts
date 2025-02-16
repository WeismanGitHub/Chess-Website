import { CreateRoom, JoinRoom, PlayerJoined, Ready, ReceiveMessage, SendMessage } from '../events'
import { minutesSchema, idSchema, messageSchema } from './zod'
import { Room, rooms, RoomState } from './rooms-cache'
import { RoomConstants } from './constants'
import CustomError from './custom-error'
import { customAlphabet } from 'nanoid'
import { decodeAuthJwt } from './jwt'
import { Socket } from 'socket.io'
import { User } from '../models'

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', RoomConstants.idLength)

function errorHandler<response>(
    listener: (body: any) => Promise<response>
): (body: any, callback: Function) => Promise<void> {
    return async function (body: any, callback: Function) {
        try {
            const res = await listener(body)

            callback({ success: true, data: res })
        } catch (err) {
            if (err instanceof CustomError) {
                console.error(err)
            }

            callback({
                success: false,
                error: err instanceof CustomError ? err.message : 'A server error occurred.',
            })
        }
    }
}

async function generateRoomId() {
    let id = nanoid()
    let retries = 5

    while (await rooms.has(id)) {
        if (retries === 0) {
            throw new Error('Cannot generate room id.')
        }

        id = nanoid()
        retries--
    }

    return id
}

export default function socketHandler(socket: Socket) {
    const cookies = socket.handshake.headers.cookie?.split(';')
    const authJwt = cookies?.find((cookie) => cookie.startsWith('auth='))?.replace('auth=', '')

    if (!authJwt) {
        return socket.disconnect()
    }

    const userId = decodeAuthJwt(authJwt)
    let roomId: string | undefined

    socket.on(
        CreateRoom.Name,
        errorHandler(async (body) => {
            const { success, data } = await minutesSchema.safeParseAsync(body)

            if (!success) {
                throw new CustomError('Invalid Body')
            }

            const id = await generateRoomId()

            await rooms.set(id, {
                minutes: data,
                started: false,
                players: [
                    {
                        id: userId,
                        ready: false,
                    },
                ],
            })

            await socket.join(id)
            roomId = id

            return id
        })
    )

    socket.on(
        JoinRoom.Name,
        errorHandler(async (body) => {
            const { success, data } = await idSchema.safeParseAsync(body)

            if (!success || data == undefined) {
                throw new CustomError('Invalid room id.')
            }

            const room = await rooms.get<Room>(data)

            if (!room) {
                throw new CustomError("That room doesn't exist.")
            }

            // if user is not already in room
            if (!room.players.some((player) => player.id === userId)) {
                if (room.players.length === 2) {
                    throw new CustomError('Room is full.')
                }

                if (socket.rooms.has(data)) {
                    throw new CustomError('You are already in this room.')
                }

                const user = await User.findById(userId)

                if (!user) {
                    throw new CustomError('Could not find your account.')
                }

                const player = { id: userId, ready: false, name: user.name }
                room.players.push(player)

                await rooms.set(data, room)
                socket.to(data).emit(PlayerJoined.Name, player)
            }

            roomId = data
            socket.join(roomId)
        })
    )

    socket.on(
        SendMessage.Name,
        errorHandler(async (body) => {
            const { success, data } = await messageSchema.safeParseAsync(body)

            if (!success) {
                throw new CustomError('That message is invalid.')
            }

            if (!roomId) {
                throw new CustomError('Please join a room.')
            }

            socket.to(roomId).emit(ReceiveMessage.Name, data)
        })
    )

    socket.on(Ready.Name, async () => {
        if (!roomId) {
            throw new CustomError('Join a room first.')
        }

        const room = await rooms.get<Room>(roomId)

        if (!room) {
            throw new CustomError("That room doesn't exist.")
        }

        if (room.players.length < 2) {
            throw new CustomError('You need 2 players to start.')
        }

        room.players = room.players.map((player) => {
            if (player.id === userId) {
                player.ready = true
            }

            return player
        })

        if (room.players.every((player) => player.ready)) {
            room.state = RoomState.Active
            socket.emit('start')
        }

        await rooms.set(roomId, room)
    })

    socket.on('make-move', async () => {
        if (!roomId) {
            throw new CustomError("You're not in a room.")
        }

        const room = await rooms.get<Room>(roomId)

        if (!room) {
            throw new CustomError("That room doesn't exist.")
        }
    })

    // maybe roll these 3 into 1 "make-move" event?
    socket.on('draw', async () => {})

    socket.on('resign', async () => {})

    socket.on('offer-rematch', async () => {})

    socket.on('disconnect', async () => {
        // delete room
    })
}

// User Flow: User goes to /games and creates a room. There will be a widget that shows their name, whether they're ready or not, and how much time they have on the clock. Once the second user joins, the blank opponent widget will be filled in. Once both users have clicked ready, the game begins. Once the game ends, the overlay is changed and the players are asked if they want a rematch.

// Back-End Structure: Redis cache to keep track of state. once both players are ready, a start-game event is emitted and the game state in redis is updated to Active. Players make moves until the game is over, at which point a game-end event is emitted. once the game is over, flush the game data to database, set game in redis to null, and set the state to Done. if an instance of the server doesnt have a locally stored Game object, then create one.

// problems: rejoining, leaving, new person joining room after someone leaves.

// solution: each room will have an id. when a user tries to rejoin, check if theyre in that room already. if they leave during a game then they forfeit. you can only join a room when theres 1 person in persons.

// Notes: Have a semi transparent gray overlay on the board and a slightly red background to the user widgets until the game begins. Once it begins, have it flash green then go to a neutral color. Display the state of the game with an overlay. Make the overlay red/green depending on who won, and add a rematch button or something. Maybe add a button to show and hide the overlay once the game is over so you can walk through the game.

// maybe a mutex is necessary for race conditions with making moves? figure it out
