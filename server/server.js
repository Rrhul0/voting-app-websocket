import { Server } from 'socket.io'
const votes = { cat: 0, dog: 0 }

const io = new Server({ cors: { origin: ['http://localhost:5173'] } })

io.on('connection', function (socket) {
    console.log('connect: '.concat(socket.id))
    socket.on('hello!', function () {
        console.log('hello from '.concat(socket.id))
    })
    socket.on('disconnect', function () {
        console.log('disconnect: '.concat(socket.id))
    })
    
    socket.on('vote', who => {
        votes[who]++
        io.emit('votes', votes)
    })
    socket.on('unvote', who => {
        votes[who]--
        io.emit('votes', votes)
    })
})



io.listen(3005)
setInterval(function () {
    if()
    io.emit('votes', votes)
}, 1000)
