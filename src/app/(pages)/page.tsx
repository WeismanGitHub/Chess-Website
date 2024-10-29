'use client'

import { useEffect, useState } from 'react'
import { DndContext } from '@dnd-kit/core'
import { Button } from 'flowbite-react'

import { Game } from '../../lib/chess'
import DroppableSquare from './Square'
import DraggablePiece from './Piece'

function setBackgroundColor(id: string, value: string) {
    const square = document.getElementById(id)

    if (square) {
        square.style.backgroundColor = value
    }
}

function resetSquareBackgrounds() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            setBackgroundColor(`overlay-${i}${j}`, 'rgb(0 0 0 / 0)') // Invisible
        }
    }
}

export default function () {
    const game = new Game()

    const [squares, setSquares] = useState(game.board.squares.flat())
    const [isMounted, setIsMounted] = useState(false)
    const [size, setSize] = useState(0)

    function updateWidth() {
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
            updateWidth()

            window.addEventListener('resize', () => {
                updateWidth()
            })
        }

        setIsMounted(true)
    }, [])

    return (
        <>
            <div>
                {isMounted && (
                    <div className="flex h-fit w-fit flex-col items-center md:flex-row md:items-start">
                        <DndContext
                            onDragEnd={({ active, over }) => {
                                if (!over) return

                                const [col, row] = active.id
                                    .toString()
                                    .split('')
                                    .map((n) => Number(n))

                                let piece =
                                    squares.find((square) => square.col == col && square.row == row)?.piece ??
                                    null

                                setSquares(
                                    squares.map((square) => {
                                        if (square.col === col && square.row === row) {
                                            square.piece = null
                                        }

                                        if (over.id == `${square.col}${square.row}`) {
                                            square.piece = piece
                                        }

                                        return square
                                    })
                                )
                            }}
                        >
                            <div
                                style={{
                                    height: size,
                                    width: size,
                                }}
                                className="board flex flex-wrap outline-8 outline-black"
                                onClick={resetSquareBackgrounds}
                            >
                                {squares.map(({ col, row, piece }) => (
                                    <DroppableSquare key={`${col}${row}`} col={col} row={row}>
                                        {piece && (
                                            <DraggablePiece
                                                size={size}
                                                key={`${col}${row}`}
                                                piece={piece}
                                                id={`${col}${row}`}
                                            />
                                        )}
                                    </DroppableSquare>
                                ))}
                            </div>
                        </DndContext>

                        <Button
                            type="button"
                            onClick={() => setSquares(squares.toReversed())}
                            className="m-3 ms-4 inline-flex items-center rounded-lg text-center text-sm font-medium text-white"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                            >
                                <path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z" />
                            </svg>
                            <span className="sr-only">reverse board</span>
                        </Button>
                    </div>
                )}
            </div>
        </>
    )
}
