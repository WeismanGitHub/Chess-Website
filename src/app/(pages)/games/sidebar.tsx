'use client'

import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { Button, TextInput } from 'flowbite-react'
import toaster from '../../components/toasts'
import { Socket } from 'socket.io-client'

function Flag() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            fill="currentColor"
            className="fill-teal-700"
            viewBox="0 0 16 16"
        >
            <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12 12 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A20 20 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a20 20 0 0 0 1.349-.476l.019-.007.004-.002h.001" />
        </svg>
    )
}

export default function Chat({ socket }: { socket: Socket<DefaultEventsMap, DefaultEventsMap> }) {
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
        <div className="m-1 flex flex-grow flex-col p-5 md:p-0">
            <div className="h-75"></div>
            <div className="h-25">
                <ul>{messages}</ul>
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
