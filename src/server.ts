import socketHandler from './lib/socket-handler'
import { decodeAuthJwt } from './lib/jwt'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { parse } from 'url'
import next from 'next'

const app = next({ dev: process.env.NODE_ENV !== 'production' })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url!, true)
        handle(req, res, parsedUrl)
    })

    const io = new Server(server)

    io.use((socket, next) => {
        const cookies = socket.handshake.headers.cookie?.split(';')
        const authJwt = cookies?.find((cookie) => cookie.startsWith('auth='))?.replace('auth=', '')

        if (!authJwt) {
            throw new Error('Please sign in.')
        }

        // @ts-ignore
        socket.userId = decodeAuthJwt(authJwt)

        next()
    })

    io.on('connection', (socket) => {
        // @ts-ignore
        socketHandler(socket)
    })

    server.listen(3000, (err?: Error) => {
        if (err) throw err

        console.log('> Server Ready')
    })
})
