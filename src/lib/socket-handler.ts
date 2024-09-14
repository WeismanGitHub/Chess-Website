import { Types } from 'mongoose'
import { Socket } from 'socket.io'

export default function socketHandler(socket: Socket) {
    if (socket.) // auth check

    socket.on('createGame', () => {
        const id = new Types.ObjectId()

        // construct the game. randomly assign the users to black/white
    })

    socket.on('joinGame', (id: string) => {
        if (!Types.ObjectId.isValid(id)) {
            throw new Error("Invalid Game Id")
        }

        // check cache
    })
}

// goal: website where users can play chess

// a signed in user connects to the socketHandler (i need to check if theyre authenticated).

// create the game in memory and store it in a cache by id. once the game is over you delete it from memory and save it in mongodb