'use client'

import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { Button, TextInput } from 'flowbite-react'
import toaster from '../../components/toasts'
import { SendMessage } from '../../../types'
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

    return (
        <div
            className="w- full mb-6 flex flex-grow flex-col rounded-lg bg-white shadow"
            style={{ height: size, minWidth: '320px' }}
        >
            <div style={{ height: '50%' }} className="bg-transparent"></div>
            <hr className="shadow" />
            <div style={{ height: '50%' }} className="flex flex-col bg-transparent">
                <ul className="w-full flex-grow">{messages}</ul>
                <form
                    name="sendMessageForm"
                    className="flex flex-row"
                    onSubmit={(e) => {
                        e.preventDefault()

                        socket.emit(SendMessage.Name, message, (res: SendMessage.Response) => {
                            if (res.success) {
                                return setMessage('')
                            }

                            toaster.error(res.error)
                        })
                    }}
                >
                    <input type="submit" hidden />
                    <TextInput
                        type="text"
                        className="w-full"
                        style={{ borderStartEndRadius: 0, borderEndEndRadius: 0 }}
                        value={message}
                        placeholder="Send a message"
                        onChange={(event) => {
                            setMessage(event.target.value)
                        }}
                    />
                    <Button type="submit" className="rounded-s-none" style={{ width: 'fit-content' }}>
                        Send
                    </Button>
                </form>
            </div>
        </div>
    )
}
