'use client'

import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { Socket } from 'socket.io-client'

export default function Chat({ socket }: { socket: Socket<DefaultEventsMap, DefaultEventsMap> }) {
    const [messages, setMessages] = useState<ReactNode[]>([])
    const messageEnd = useRef(null)

    useEffect(() => {
        // @ts-expect-error nothing
        messageEnd.current?.scrollIntoView({ behavior: 'instant' })
    }, [messages])

    socket.on('receive message', (message: string) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            <li
                className="bg-info mb-1 rounded p-2"
                style={{ color: 'white', width: 'fit-content' }}
                key={Date.now() + Math.random()}
            >
                {message}
            </li>,
        ])
    })
    
    socket.emit('')

    return (
        <div className="w-25 h-full">
            <ul>{messages}</ul>
        </div>
    )
}
