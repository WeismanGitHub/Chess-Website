'use client'

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { idSchema, minutesSchema } from '../../../lib/zod'
import { Button, Label, TextInput } from 'flowbite-react'
import { io, Socket } from 'socket.io-client'
import { Form, Formik } from 'formik'

import { CreateRoom, JoinRoom } from '../../../lib/socket-handler'
import toaster from '../../components/toasts'
import Board from '../../components/board'
import Sidebar from './sidebar'

function StopwatchIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12 14V11M12 6C7.85786 6 4.5 9.35786 4.5 13.5C4.5 17.6421 7.85786 21 12 21C16.1421 21 19.5 17.6421 19.5 13.5C19.5 11.5561 18.7605 9.78494 17.5474 8.4525M12 6C14.1982 6 16.1756 6.94572 17.5474 8.4525M12 6V3M19.5 6.5L17.5474 8.4525M12 3H9M12 3H15"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function RoomTabs({
    setSocket,
}: {
    setSocket: Dispatch<SetStateAction<Socket<DefaultEventsMap, DefaultEventsMap> | null>>
}) {
    const [tab, setTab] = useState<'create' | 'join'>('create')

    return (
        <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 lg:m-5 xl:p-0">
            <ul
                role="tablist"
                style={{ borderTopLeftRadius: '0.5em', borderTopRightRadius: '0.5em' }}
                className="text-md flex text-center font-semibold text-gray-700 shadow"
            >
                <li className="w-full focus-within:z-10">
                    <button
                        role="tab"
                        onClick={() => setTab('create')}
                        className={`inline-block w-full rounded-tl-lg border-r border-gray-200 p-4 focus:outline-none focus:ring-4 focus:ring-cyan-300 ${tab == 'create' ? 'bg-gray-100 hover:bg-gray-100' : 'bg-white hover:bg-gray-50'}`}
                        aria-current="page"
                    >
                        Create
                    </button>
                </li>
                <li className="w-full focus-within:z-10">
                    <button
                        onClick={() => setTab('join')}
                        role="tab"
                        className={`inline-block w-full rounded-tr-lg border-l border-gray-200 p-4 focus:outline-none focus:ring-4 focus:ring-cyan-300 ${tab == 'join' ? 'bg-gray-100 hover:bg-gray-100' : 'bg-white hover:bg-gray-50'}`}
                    >
                        Join
                    </button>
                </li>
            </ul>
            <div hidden={tab !== 'create'} className="space-y-4 p-6 sm:p-8 md:space-y-6">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                    Create a room
                </h1>
                <Formik
                    initialValues={{
                        minutes: 30,
                    }}
                    validate={(values) => {
                        const errors: {
                            minutes?: string
                        } = {}

                        const res = minutesSchema.safeParse(values.minutes)

                        if (!res.success) {
                            errors.minutes = res.error.flatten().formErrors?.[0]
                        }

                        return errors
                    }}
                    onSubmit={async (values) => {
                        const socket = io()

                        socket.on('connect', () => {
                            socket.emit(CreateRoom.Name, values.minutes, (res: CreateRoom.Response) => {
                                if (res.success) {
                                    return setSocket(socket)
                                }

                                toaster.error(res.error)
                            })
                        })
                    }}
                    validateOnChange={true}
                    validateOnBlur={true}
                >
                    {({ handleSubmit, values, errors, touched, setTouched, setFieldValue }) => {
                        return (
                            <Form className="mb-4 space-y-4 md:space-y-6" noValidate onSubmit={handleSubmit}>
                                <div className="m-0 flex w-full flex-col items-center justify-center">
                                    <div className="relative mx-auto flex max-w-[11rem] items-center">
                                        <button
                                            type="button"
                                            id="decrement-button"
                                            data-input-counter-decrement="quantity-input"
                                            className={`h-11 rounded-s-lg border border-gray-300 bg-gray-100 p-3 hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-100 ${errors.minutes ? 'border-red-500 bg-red-50 text-red-900 hover:bg-red-100 focus:border-red-500 focus:ring-red-500' : ''}`}
                                            onClick={() => {
                                                setTouched({
                                                    minutes: true,
                                                    ...touched,
                                                })

                                                setFieldValue('minutes', values.minutes - 1)
                                            }}
                                        >
                                            <svg
                                                className="h-3 w-3 text-gray-900"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 18 2"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M1 1h16"
                                                />
                                            </svg>
                                        </button>
                                        <input
                                            type="text"
                                            id="quantity-input"
                                            data-input-counter
                                            style={{ zIndex: 20 }}
                                            aria-describedby="helper-text-explanation"
                                            className={`block h-11 w-full rounded-none border-gray-300 bg-gray-50 py-2.5 pt-0 text-center text-sm text-gray-900 focus:rounded-sm focus:border-none focus:ring-2 focus:ring-cyan-500 ${errors.minutes ? 'border-red-500 bg-red-50 text-red-900 focus:ring-red-500' : ''}`}
                                            required
                                            placeholder="0"
                                            value={values.minutes}
                                            onChange={(e) => {
                                                setTouched({
                                                    minutes: true,
                                                    ...touched,
                                                })

                                                const value = Number(e.target.value)

                                                if (e.target.value == '-') {
                                                    return setFieldValue('minutes', 0)
                                                }

                                                if (!Number.isNaN(value)) {
                                                    setFieldValue('minutes', value)
                                                }
                                            }}
                                        />
                                        <div
                                            className={`absolute bottom-1 start-1/2 flex -translate-x-1/2 items-center space-x-1 stroke-gray-400 pt-0 text-xs text-gray-400 rtl:translate-x-1/2 rtl:space-x-reverse ${errors.minutes ? 'stroke-red-900 text-red-900' : ''}`}
                                            style={{ zIndex: 20 }}
                                        >
                                            <StopwatchIcon />
                                            <span className="m-0 p-0">Minutes</span>
                                        </div>
                                        <button
                                            type="button"
                                            id="increment-button"
                                            onClick={() => {
                                                setTouched({
                                                    minutes: true,
                                                    ...touched,
                                                })

                                                setFieldValue('minutes', values.minutes + 1)
                                            }}
                                            style={{ zIndex: 1 }}
                                            data-input-counter-increment="quantity-input"
                                            className={`h-11 rounded-e-lg border border-gray-300 bg-gray-100 p-3 hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-100 ${errors.minutes ? 'border-red-500 bg-red-50 text-red-900 hover:bg-red-100 focus:border-red-500 focus:ring-red-500' : ''}`}
                                        >
                                            <svg
                                                className="h-3 w-3 text-gray-900"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 18 18"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 1v16M1 9h16"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                    <p style={{ marginTop: '1%' }} className="w-fit text-sm text-red-600">
                                        {errors.minutes}
                                    </p>
                                </div>
                                <Button
                                    type="submit"
                                    className="text-md w-full rounded-lg px-5 py-2.5 text-center focus:outline-none focus:ring-4"
                                >
                                    Create room
                                </Button>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
            <div hidden={tab !== 'join'} className="space-y-4 p-6 sm:p-8 md:space-y-6">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                    Join a room
                </h1>
                <Formik
                    initialValues={{
                        id: '',
                    }}
                    validate={(values) => {
                        const errors: {
                            id?: string
                        } = {}

                        const res = idSchema.safeParse(values.id)

                        if (!res.success) {
                            errors.id = res.error.flatten().formErrors?.[0]
                        }

                        return errors
                    }}
                    onSubmit={async (values) => {
                        const socket = io()

                        socket.on('connect', () => {
                            socket.emit(JoinRoom.Name, values.id, (res: JoinRoom.Response) => {
                                if (res.success) {
                                    return setSocket(socket)
                                }

                                toaster.error(res.error)
                            })
                        })
                    }}
                    validateOnChange={true}
                    validateOnBlur={true}
                >
                    {({ handleSubmit, handleChange, handleBlur, values, errors, touched, setTouched }) => {
                        return (
                            <Form className="mb-4 space-y-4 md:space-y-6" noValidate onSubmit={handleSubmit}>
                                <div>
                                    <Label
                                        htmlFor="name"
                                        className="mb-2 block text-sm font-medium text-gray-900"
                                    >
                                        Id
                                    </Label>
                                    <TextInput
                                        type="text"
                                        name="id"
                                        value={values.id}
                                        placeholder="2qz6"
                                        required={true}
                                        onBlur={handleBlur}
                                        onChange={(target) => {
                                            setTouched({
                                                id: true,
                                                ...touched,
                                            })

                                            handleChange(target)
                                        }}
                                        helperText={
                                            touched.id && errors.id ? <span>{errors.id}</span> : undefined
                                        }
                                        color={touched.id && errors.id ? 'failure' : undefined}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="text-md w-full rounded-lg px-5 py-2.5 text-center focus:outline-none focus:ring-4"
                                >
                                    Create room
                                </Button>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </div>
    )
}

// function UserWidget({ time, name, ready }: { time: number; name: string | null; ready: boolean }) {
//     return (
//         <div className="w-full">
//             <div className="left-0">
//                 {name}
//                 {ready ? (
//                     <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="16"
//                         height="16"
//                         fill="currentColor"
//                         className="bi bi-check-square-fill"
//                         viewBox="0 0 16 16"
//                     >
//                         <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z" />
//                     </svg>
//                 ) : (
//                     <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="16"
//                         height="16"
//                         fill="currentColor"
//                         className="bi bi-x-square-fill"
//                         viewBox="0 0 16 16"
//                     >
//                         <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708" />
//                     </svg>
//                 )}
//             </div>
//             <span className="right-0">{time}</span>
//         </div>
//     )
// }

function Game({ socket }: { socket: Socket<DefaultEventsMap, DefaultEventsMap> }) {
    const [size, setSize] = useState(0)

    function updateSize() {
        if (window.innerHeight > window.innerWidth) {
            // vertical screen
            if (window.innerWidth < 500) {
                setSize(window.innerWidth > 320 ? window.innerWidth : 320)
            } else {
                setSize(window.innerWidth * 0.8)
            }
        } else {
            // horizontal screen
            if (window.innerHeight < 500) {
                setSize(window.innerHeight > 320 ? window.innerHeight : 320)
            } else {
                setSize(window.innerHeight * 0.8)
            }
        }
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            updateSize()

            window.addEventListener('resize', () => {
                updateSize()
            })
        }
    }, [])

    return (
        <div className="flex h-full w-full flex-row flex-wrap justify-center gap-2">
            <div className=""></div>
            <Board size={size} />
            <div></div>
            <Sidebar socket={socket} size={size} />
        </div>
    )
}

export default function () {
    const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null)

    return (
        <div className="mx-auto flex h-full w-full flex-col items-center justify-center px-6 py-8 lg:py-0">
            {socket ? <Game socket={socket} /> : <RoomTabs setSocket={setSocket} />}
        </div>
    )
}
