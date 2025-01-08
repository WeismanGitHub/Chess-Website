'use client'

import { ReceiveMessage, SendMessage } from '../../../../events'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import React, { ReactNode, useEffect, useState } from 'react'
import { Button, TextInput } from 'flowbite-react'
import toaster from '../../../components/toasts'
import { Socket } from 'socket.io-client'

function UserWidget({ time, name, ready }: { time: number; name: string | null; ready: boolean }) {
    return (
        <div className="w-full">
            <div className="left-0">
                {name}
                {ready ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-check-square-fill"
                        viewBox="0 0 16 16"
                    >
                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z" />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-x-square-fill"
                        viewBox="0 0 16 16"
                    >
                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708" />
                    </svg>
                )}
            </div>
            <span className="right-0">{time}</span>
        </div>
    )
}

export default function Chat({
    socket,
    size,
}: {
    socket: Socket<DefaultEventsMap, DefaultEventsMap>
    size: number
}) {
    const [messages, setMessages] = useState<ReactNode[]>([])
    const [draft, setDraft] = useState('')

    useEffect(() => {
        const element = document.getElementById('messages')
        element?.scrollTo(0, element.scrollHeight)
    }, [messages])

    socket.on(ReceiveMessage.Name, (message: ReceiveMessage.Response) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            <li
                className="bg-info rounded"
                style={{ color: 'black', width: 'fit-content' }}
                key={Date.now() + Math.random()}
            >
                {message}
            </li>,
        ])
    })

    return (
        <div
            className="mb-6 flex flex-grow flex-col rounded-lg bg-white shadow"
            style={{ height: size, minWidth: '320px' }}
        >
            <div style={{ height: '50%' }} className="bg-transparent"></div>
            <hr className="shadow" />
            <div style={{ height: '50%' }} className="flex flex-col bg-transparent">
                <ul id="messages" className="flex-grow overflow-y-scroll break-all">
                    {messages}
                </ul>
                <form
                    name="sendMessageForm"
                    className="flex flex-row"
                    onSubmit={(e) => {
                        e.preventDefault()

                        socket.emit(SendMessage.Name, draft, (res: SendMessage.Response) => {
                            if (res.success) {
                                setMessages((prevMessages) => [
                                    ...prevMessages,
                                    <li
                                        className="bg-info mb-1 rounded p-2"
                                        style={{ color: 'black', width: 'fit-content' }}
                                        key={Date.now() + Math.random()}
                                    >
                                        {draft}
                                    </li>,
                                ])

                                return setDraft('')
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
                        value={draft}
                        placeholder="Send a message"
                        onChange={(event) => {
                            setDraft(event.target.value)
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
