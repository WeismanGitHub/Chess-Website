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

    io.on('connection', (socket) => {
        console.log('Client connected')

        socket.on('disconnect', () => {
            console.log('Client disconnected')
        })
    })

    server.listen(3000, (err?: Error) => {
        if (err) throw err

        console.log('> Server Ready')
    })
})
