'use client'

import { Button, Label, Tabs, TextInput } from 'flowbite-react'
import { lobbyJoinSchema, lobbyCreateSchema } from '../../../lib/zod'
import { FailureToast } from '../../components/toasts'
import React, { useEffect, useState } from 'react'
import { Game } from '../../../lib/chess'
import { io } from 'socket.io-client'
import { Form, Formik } from 'formik'
import svgs from './pieces-svgs'
import Image from 'next/image'

function Board({ game }: { game: Game }) {
    const [active, setActive] = useState<[number, number] | null>(null)
    const [coords, setCoords] = useState<[number, number]>([0, 0])
    const [isMounted, setIsMounted] = useState(false)
    const [size, setSize] = useState(0)
    const borderSize = 12

    function updateWidth() {
        if (window.innerHeight > window.innerWidth) {
            // vertical screen
            const width = window.innerWidth * 0.09
            setSize(width > 38 ? width : 38)
        } else {
            // horizontal screen
            const width = window.innerHeight * 0.09
            setSize(width > 38 ? width : 38)
        }
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            updateWidth()

            window.addEventListener('resize', () => {
                updateWidth()
            })
        }

        setIsMounted(true)
    }, [])

    console.log(coords)

    useEffect(() => {
        if (!active) {
            return
        }

        const piece = document.getElementById(`${active[0]}${active[1]}`)

        piece?.setAttribute('x', coords[0].toString())
        piece?.setAttribute('y', coords[1].toString())
    }, [coords])

    return (
        <>
            {isMounted && (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height={size * game.board.rows + borderSize}
                    width={size * game.board.rows + borderSize}
                    onMouseMove={(e) => {
                        // @ts-ignore
                        const svgRect = e.currentTarget.getBoundingClientRect()
                        const x = e.clientX - svgRect.left
                        const y = e.clientY - svgRect.top
                        setCoords([x, y])
                    }}
                    onClick={() => {
                        setActive(null)
                        // if (!active) {
                        //     return
                        // }

                        // const piece = document.getElementById(`${active[0]}${active[1]}`)

                        // piece?.setAttribute('x', active[0].toString())
                        // piece?.setAttribute('y', active[1].toString())
                    }}
                >
                    <g>
                        {game.board.squares.map((row) =>
                            row.map((square) => {
                                const evenCol = square.col % 2 === 1
                                const evenRow = square.row % 2 === 1

                                const color = evenRow
                                    ? evenCol
                                        ? '#0e7490'
                                        : '#e8f2f5'
                                    : evenCol
                                      ? '#e8f2f5'
                                      : '#0e7490'

                                const name = square?.piece?.constructor.name.toLowerCase()

                                const adjustedY = size * (game.board.rows - square.row - 1) + borderSize / 2

                                return (
                                    <g key={`${square.col}${square.row}`}>
                                        <rect
                                            width={size}
                                            height={size}
                                            y={adjustedY}
                                            x={size * square.col + borderSize / 2}
                                            fill={color}
                                            id={`${square.col}${square.row}${square.piece?.color}`}
                                        />
                                        {square.piece && (
                                            <svg
                                                id={`${square.col}${square.row}`}
                                                width={size}
                                                height={size}
                                                y={adjustedY}
                                                x={size * square.col + borderSize / 2}
                                                z={999}
                                                style={{
                                                    filter:
                                                        square.piece.color === 'black'
                                                            ? 'invert(100%)'
                                                            : 'invert(0%)',
                                                    cursor: 'grab',
                                                }}
                                                onClick={() => {}}
                                                onMouseDown={() => {
                                                    setActive([square.col, square.row])
                                                }}
                                            >
                                                {svgs[name!]}
                                            </svg>
                                        )}
                                    </g>
                                )
                            })
                        )}
                    </g>

                    <rect
                        width={size * game.board.rows + borderSize}
                        height={size * game.board.rows + borderSize}
                        fill="none"
                        stroke="black"
                        strokeWidth="12"
                    />
                </svg>
            )}
        </>
    )
}

export default function () {
    const [message, setMessage] = useState<string | null>(null)
    const [id, setId] = useState<string | null>(null)
    const [game, setGame] = useState<Game | null>(null)

    useEffect(() => {
        if (id) {
            setGame(new Game())
        }
    }, [id])

    return (
        <>
            <FailureToast
                message={message ?? ''}
                show={message !== null}
                handleDismiss={() => setMessage(null)}
            />

            <div className="mx-auto flex w-full flex-col items-center justify-center px-6 py-8 lg:py-0">
                {game ? (
                    <Board game={new Game()} />
                ) : (
                    <div className="w-full overflow-hidden rounded-lg bg-white shadow sm:max-w-md md:mt-0 lg:m-5 xl:p-0">
                        <Tabs aria-label="lobby tabs" variant="fullWidth">
                            <Tabs.Item active title="Create">
                                <div className="space-y-4 p-6 pt-0 sm:p-8 sm:pt-0 md:space-y-6">
                                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                        Create a lobby
                                    </h1>
                                    <Formik
                                        initialValues={{
                                            name: '',
                                            password: '',
                                            minutes: 30,
                                        }}
                                        validate={(values) => {
                                            const errors: {
                                                name?: string
                                                password?: string
                                                minutes?: string
                                            } = {}

                                            const res = lobbyCreateSchema.safeParse(values)

                                            if (!res.success) {
                                                const fieldErrors = res.error.flatten().fieldErrors
                                                errors.name = fieldErrors.name?.[0]
                                                errors.password = fieldErrors.password?.[0]
                                                errors.minutes = fieldErrors.minutes?.[0]
                                            }

                                            return errors
                                        }}
                                        onSubmit={async (values) => {
                                            const socket = io()

                                            socket.on('connect', () => {
                                                socket.emit(
                                                    'createLobby',
                                                    values,
                                                    ({ success, data }: { success: boolean; data: any }) => {
                                                        if (success) {
                                                            return setId(data)
                                                        }

                                                        setMessage(data)
                                                    }
                                                )
                                            })
                                        }}
                                        validateOnChange={true}
                                        validateOnBlur={true}
                                    >
                                        {({
                                            handleSubmit,
                                            handleChange,
                                            handleBlur,
                                            values,
                                            errors,
                                            touched,
                                            setTouched,
                                            setFieldValue,
                                        }) => {
                                            return (
                                                <Form
                                                    className="mb-4 space-y-4 md:space-y-6"
                                                    noValidate
                                                    onSubmit={handleSubmit}
                                                >
                                                    <div>
                                                        <Label
                                                            htmlFor="name"
                                                            className="mb-2 block text-sm font-medium text-gray-900"
                                                        >
                                                            Name
                                                        </Label>
                                                        <TextInput
                                                            type="text"
                                                            name="name"
                                                            id="name"
                                                            value={values.name}
                                                            placeholder="lobby name"
                                                            required={true}
                                                            onBlur={handleBlur}
                                                            onChange={(target) => {
                                                                setTouched({
                                                                    name: true,
                                                                    ...touched,
                                                                })

                                                                handleChange(target)
                                                            }}
                                                            helperText={
                                                                touched.name && errors.name ? (
                                                                    <span>{errors.name}</span>
                                                                ) : undefined
                                                            }
                                                            color={
                                                                touched.name && errors.name
                                                                    ? 'failure'
                                                                    : undefined
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label
                                                            htmlFor="password"
                                                            className="mb-2 block text-sm font-medium text-gray-900"
                                                        >
                                                            Password
                                                        </Label>
                                                        <TextInput
                                                            value={values.password}
                                                            onChange={(target) => {
                                                                setTouched({
                                                                    password: true,
                                                                    ...touched,
                                                                })
                                                                handleChange(target)
                                                            }}
                                                            autoComplete="on"
                                                            type="text"
                                                            onBlur={handleBlur}
                                                            name="password"
                                                            id="password"
                                                            placeholder="••••••••••"
                                                            required={true}
                                                            helperText={
                                                                touched.password && errors.password ? (
                                                                    <span>{errors.password}</span>
                                                                ) : undefined
                                                            }
                                                            color={
                                                                touched.password && errors.password
                                                                    ? 'failure'
                                                                    : undefined
                                                            }
                                                        />
                                                    </div>
                                                    <div className="m-0 flex w-full flex-col items-center justify-center">
                                                        <div className="relative mx-auto flex max-w-[11rem] items-center">
                                                            <button
                                                                type="button"
                                                                id="decrement-button"
                                                                data-input-counter-decrement="quantity-input"
                                                                className={`h-11 rounded-s-lg border border-gray-300 bg-gray-100 p-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 ${errors.minutes ? 'border-red-500 bg-red-50 text-red-900 hover:bg-red-100 focus:border-red-500' : ''}`}
                                                                onClick={() => {
                                                                    setTouched({
                                                                        minutes: true,
                                                                        ...touched,
                                                                    })

                                                                    setFieldValue(
                                                                        'minutes',
                                                                        values.minutes - 1
                                                                    )
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
                                                                style={{ zIndex: 0 }}
                                                                aria-describedby="helper-text-explanation"
                                                                className={`block h-11 w-full border-x-0 border-gray-300 bg-gray-50 py-2.5 pt-2 text-center text-sm text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 ${errors.minutes ? 'border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500' : ''}`}
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
                                                            <div className="absolute bottom-1 start-1/2 flex -translate-x-1/2 items-center space-x-1 text-xs text-gray-400 rtl:translate-x-1/2 rtl:space-x-reverse">
                                                                <Image
                                                                    src="/stopwatch.svg"
                                                                    alt="stopwatch icon"
                                                                    width={15}
                                                                    height={15}
                                                                />
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

                                                                    setFieldValue(
                                                                        'minutes',
                                                                        values.minutes + 1
                                                                    )
                                                                }}
                                                                data-input-counter-increment="quantity-input"
                                                                className={`h-11 rounded-e-lg border border-gray-300 bg-gray-100 p-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 ${errors.minutes ? 'border-red-500 bg-red-50 text-red-900 hover:bg-red-100 focus:border-red-500' : ''}`}
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
                                                        <p
                                                            style={{ marginTop: '1%' }}
                                                            className="w-fit text-sm text-red-600"
                                                        >
                                                            {errors.minutes}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        type="submit"
                                                        className="text-md w-full rounded-lg px-5 py-2.5 text-center focus:outline-none focus:ring-4"
                                                    >
                                                        Create lobby
                                                    </Button>
                                                </Form>
                                            )
                                        }}
                                    </Formik>
                                </div>
                            </Tabs.Item>
                            <Tabs.Item title="Join">
                                <div className="space-y-4 p-6 pt-0 sm:p-8 sm:pt-0 md:space-y-6">
                                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                        Join a lobby
                                    </h1>
                                    <Formik
                                        initialValues={{
                                            name: '',
                                            password: '',
                                        }}
                                        validate={(values) => {
                                            const errors: {
                                                name?: string
                                                password?: string
                                            } = {}

                                            const res = lobbyJoinSchema.safeParse(values)

                                            if (!res.success) {
                                                const fieldErrors = res.error.flatten().fieldErrors
                                                errors.name = fieldErrors.name?.[0]
                                                errors.password = fieldErrors.password?.[0]
                                            }

                                            return errors
                                        }}
                                        onSubmit={async (values) => {
                                            console.log(values)
                                            const socket = io()

                                            socket.on('connect', () => {
                                                socket.emit(
                                                    'joinLobby',
                                                    values,
                                                    ({ success, data }: { success: boolean; data: any }) => {
                                                        if (success) {
                                                            return setId(data)
                                                        }

                                                        setMessage(data)
                                                    }
                                                )
                                            })
                                        }}
                                        validateOnChange={true}
                                        validateOnBlur={true}
                                    >
                                        {({
                                            handleSubmit,
                                            handleChange,
                                            handleBlur,
                                            values,
                                            errors,
                                            touched,
                                            setTouched,
                                        }) => {
                                            return (
                                                <Form
                                                    className="mb-4 space-y-4 md:space-y-6"
                                                    noValidate
                                                    onSubmit={handleSubmit}
                                                >
                                                    <div>
                                                        <Label
                                                            htmlFor="name"
                                                            className="mb-2 block text-sm font-medium text-gray-900"
                                                        >
                                                            Name
                                                        </Label>
                                                        <TextInput
                                                            type="text"
                                                            name="name"
                                                            id="name"
                                                            value={values.name}
                                                            placeholder="lobby name"
                                                            required={true}
                                                            onBlur={handleBlur}
                                                            onChange={(target) => {
                                                                setTouched({
                                                                    name: true,
                                                                    ...touched,
                                                                })

                                                                handleChange(target)
                                                            }}
                                                            helperText={
                                                                touched.name && errors.name ? (
                                                                    <span>{errors.name}</span>
                                                                ) : undefined
                                                            }
                                                            color={
                                                                touched.name && errors.name
                                                                    ? 'failure'
                                                                    : undefined
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label
                                                            htmlFor="password"
                                                            className="mb-2 block text-sm font-medium text-gray-900"
                                                        >
                                                            Password
                                                        </Label>
                                                        <TextInput
                                                            value={values.password}
                                                            onChange={(target) => {
                                                                setTouched({
                                                                    password: true,
                                                                    ...touched,
                                                                })
                                                                handleChange(target)
                                                            }}
                                                            autoComplete="on"
                                                            type="text"
                                                            onBlur={handleBlur}
                                                            name="password"
                                                            id="password"
                                                            placeholder="••••••••••"
                                                            required={true}
                                                            helperText={
                                                                touched.password && errors.password ? (
                                                                    <span>{errors.password}</span>
                                                                ) : undefined
                                                            }
                                                            color={
                                                                touched.password && errors.password
                                                                    ? 'failure'
                                                                    : undefined
                                                            }
                                                        />
                                                    </div>
                                                    <Button
                                                        type="submit"
                                                        className="text-md w-full rounded-lg px-5 py-2.5 text-center focus:outline-none focus:ring-4"
                                                    >
                                                        Create lobby
                                                    </Button>
                                                </Form>
                                            )
                                        }}
                                    </Formik>
                                </div>
                            </Tabs.Item>
                        </Tabs>
                    </div>
                )}
            </div>
        </>
    )
}
