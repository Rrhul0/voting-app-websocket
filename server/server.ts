import { Server } from 'socket.io'
import { config } from 'dotenv'

const votes = { cat: 0, dog: 0 }

config()

const corsOrigins = [
    'http://localhost:5173',
    'http://localhost:4173',
    process.env.ORIGIN1 || '',
    process.env.ORIGIN2 || '',
]

const io = new Server({ cors: { origin: corsOrigins } })
console.log('here')
io.on('connection', function (socket) {
    console.log('here 2')
    console.log('connect: ', socket.id)
    io.emit('votes', votes)
    socket.on('hello!', function () {
        console.log('hello from '.concat(socket.id))
    })
    socket.on('disconnect', function () {
        console.log('disconnect: '.concat(socket.id))
    })
    socket.on('vote', (who: 'dog' | 'cat') => {
        votes[who]++
        socket.broadcast.emit('votes', votes)
        // io.emit('votes', votes)
    })
    socket.on('unvote', (who: 'dog' | 'cat') => {
        votes[who]--
        socket.broadcast.emit('votes', votes)
        // io.emit('votes', votes)
    })
})
io.listen(Number(process.env.PORT) || 3005)
