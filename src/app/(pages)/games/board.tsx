'use client'

import React, { useEffect, useState } from 'react'
import { Game } from '../../../lib/chess'
import svgs from './pieces-svgs'

export default function Board() {
    const game = new Game()

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
