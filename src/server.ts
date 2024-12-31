import socketHandler from './lib/socket-handler'
import dbConnect from './lib/db-connect'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { parse } from 'url'
import next from 'next'

const app = next({ dev: process.env.NODE_ENV !== 'production' })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    dbConnect()
    
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url!, true)
        handle(req, res, parsedUrl)
    })

    const io = new Server(server)

    io.on('connection', (socket) => {
        socketHandler(socket)
    })

    server.listen(3000, (err?: Error) => {
        if (err) throw err

        console.log('> Server Ready')
    })
})
