import { useEffect, useState } from 'react'
import './App.css'

import io from 'socket.io-client'

const socket = io('localhost:3005')

function App() {
    const [voted, setVoted] = useState<'none' | 'cat' | 'dog'>('none')
    const [votesCat, setVotesCat] = useState(0)
    const [votesDog, setVotesDog] = useState(0)

    useEffect(() => {
        socket.on('message', data => {
            console.log(data)
        })
        socket.on('votes', data => {
            setVotesCat(data.cat)
            setVotesDog(data.dog)
        })
        return () => {
            socket.offAny()
        }
    })

    function vote(who: 'cat' | 'dog') {
        console.log(who, voted)
        if (voted === who) return
        if (voted !== 'none') {
            socket.emit('unvote', voted)
        }
        setVoted(who)
        socket.emit('vote', who)
    }

    return (
        <div className='App'>
            <button className='box' onClick={() => vote('cat')}>
                Cat {votesCat}
            </button>
            <div>OR</div>
            <button className='box' onClick={() => vote('dog')}>
                Dog {votesDog}
            </button>
        </div>
    )
}

export default App
