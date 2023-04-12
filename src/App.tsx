import { useEffect, useState } from 'react'

import io from 'socket.io-client'

const socket = io(import.meta.env.VITE_SOCKET_URL || 'localhost:3005')

function App() {
    const [voted, setVoted] = useState<'none' | 'cat' | 'dog'>('none')
    const [votesCat, setVotesCat] = useState(0)
    const [votesDog, setVotesDog] = useState(0)

    console.log(import.meta.env.VITE_SOCKET_URL)

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

    function vote(who: 'cat' | 'dog' | 'none') {
        if (voted === who) return
        //if changing vote or removing the vote first need to unvote
        if (voted !== 'none' || who === 'none') socket.emit('unvote', voted)

        setVoted(who)
        socket.emit('vote', who)
    }

    const votesPercent = {
        cat: votesCat + votesDog !== 0 ? ((votesCat * 100) / (votesCat + votesDog)).toFixed(2) : 0,
        dog: votesCat + votesDog !== 0 ? ((votesDog * 100) / (votesCat + votesDog)).toFixed(2) : 0,
    }

    return (
        <main className='flex flex-col w-screen h-screen justify-center gap-6 bg-slate-200'>
            <h1 className='text-5xl font-extrabold text-center'>Vote for</h1>
            <div className='flex items-center justify-center gap-4 h-1/3'>
                <button
                    className={
                        'flex flex-col gap-2 items-center justify-center aspect-square h-full rounded-lg border-2 relative overflow-hidden ' +
                        `${voted === 'cat' ? ' border-green-400 ' : ' '}`
                    }
                    onClick={() => vote('cat')}
                >
                    <h2 className='text-lg font-semibold'>Cat</h2>
                    <div className='font-light text-sm'>
                        {votesCat} votes · {votesPercent.cat}%
                    </div>
                    <div
                        style={{ height: votesPercent.cat + '%' }}
                        className='absolute left-0 right-0 bottom-0 bg-pink-400 bg-opacity-50 rounded transition-all duration-700'
                    ></div>
                </button>
                <div>OR</div>

                <button
                    className={
                        'flex flex-col gap-2 items-center justify-center aspect-square h-full rounded-lg border-2 relative overflow-hidden ' +
                        `${voted === 'dog' ? 'border-green-400' : ''}`
                    }
                    onClick={() => vote('dog')}
                >
                    <h2 className='text-lg font-semibold'>Dog</h2>
                    <div className='font-light text-sm'>
                        {votesDog} votes · {votesPercent.dog}%
                    </div>
                    <div
                        style={{ height: votesPercent.dog + '%' }}
                        className={
                            'absolute left-0 right-0 bottom-0 bg-pink-400 bg-opacity-50 rounded transition-all duration-700'
                        }
                    ></div>
                </button>
            </div>
            <h2 className='text-center text-lg font-semibold'>Total {votesCat + votesDog} votes</h2>
            <button
                onClick={() => vote('none')}
                className='self-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900'
            >
                Remove your vote
            </button>
        </main>
    )
}

export default App
