'use client'

import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { Button, TextInput } from 'flowbite-react'
import toaster from '../../components/toasts'
import { Socket } from 'socket.io-client'

export default function Chat({
    socket,
    size,
}: {
    socket: Socket<DefaultEventsMap, DefaultEventsMap>
    size: number
}) {
    const [messages, setMessages] = useState<ReactNode[]>([])
    const [message, setMessage] = useState('')
    const messageEnd = useRef(null)

    useEffect(() => {
        // @ts-expect-error nothing
        messageEnd.current?.scrollIntoView({ behavior: 'instant' })
    }, [messages])

    socket.on('receive message', (message: string) => {
        console.log(message)
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

    function sendMessage() {
        socket.emit('send message', message, ({ success, data }: { success: boolean; data: any }) => {
            if (!success) {
                console.log(data)
                toaster.error(data)
            } else {
                setMessage('')
            }
        })
    }

    return (
        <div
            className="w-100 mb-6 flex flex-grow flex-col rounded-lg bg-white shadow"
            style={{ height: size, minWidth: '320px' }}
        >
            <div style={{ height: '50%' }} className="bg-transparent"></div>
            <hr className="shadow" />
            <div style={{ height: '50%' }} className="flex flex-col bg-transparent">
                <ul className="w-full flex-grow">{messages}</ul>
                <form
                    className="flex flex-row"
                    onSubmit={(e) => {
                        e.preventDefault()
                        sendMessage()
                    }}
                >
                    <TextInput
                        type="text"
                        className="w-full"
                        style={{ borderStartEndRadius: 0, borderEndEndRadius: 0 }}
                        value={message}
                        placeholder="Send a message"
                        onChange={(event) => {
                            setMessage(event.target.value)
                        }}
                        onKeyDown={(event) => {
                            if (!message.length) return

                            event.key === 'Enter' && sendMessage()
                        }}
                    />
                    <Button
                        type="button"
                        className="rounded-s-none"
                        onClick={sendMessage}
                        style={{ width: 'fit-content' }}
                    >
                        Send
                    </Button>
                </form>
            </div>
        </div>
    )
}
