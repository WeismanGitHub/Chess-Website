'use client'

import { King, Piece, Queen, Pawn, Bishop, Rook, Knight } from '../../../lib/chess/pieces'
import React, { ReactNode, useEffect, useState } from 'react'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider, useDrag } from 'react-dnd'
import { Game } from '../../../lib/chess'
import { Button } from 'flowbite-react'

function setHue(id: string, value: number) {
    const square = document.getElementById(id)

    if (square) {
        square.style.filter = `hue-rotate(${value}deg)`
    }
}

function resetSquareHues() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            setHue(`square-${i}-${j}`, 0)
        }
    }
}

function getPieceCharacter(piece: Piece) {
    if (piece instanceof King) {
        return '♚'
    } else if (piece instanceof Queen) {
        return '♛'
    } else if (piece instanceof Rook) {
        return '♜'
    } else if (piece instanceof Bishop) {
        return '♝'
    } else if (piece instanceof Knight) {
        return '♞'
    } else if (piece instanceof Pawn) {
        return '♟'
    }
}

function Square({
    dark = false,
    children = undefined,
    id,
}: {
    dark?: boolean
    children?: ReactNode
    id: string
}) {
    return (
        <div
            onContextMenu={(e) => {
                e.preventDefault()

                e.currentTarget.style.filter =
                    e.currentTarget.style.filter === 'hue-rotate(0deg)'
                        ? 'hue-rotate(150deg)'
                        : 'hue-rotate(0deg)'
            }}
            id={id}
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: dark ? '#0e7490' : '#e8f2f5',
                filter: 'hue-rotate(0deg)',
            }}
            className="flex justify-center align-middle"
        >
            {children}
        </div>
    )
}

const ItemTypes = {
    KNIGHT: 'knight',
}

export default function Board() {
    const game = new Game()

    const [isMounted, setIsMounted] = useState(false)
    const [flipped, setFlipped] = useState(false)
    const [size, setSize] = useState(0)

    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.KNIGHT,
        collect: (monitor: any) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }))

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
            {isMounted && (
                <div className="flex h-fit w-fit flex-col items-center md:flex-row md:items-start">
                    <DndProvider backend={HTML5Backend}>
                        <div
                            style={{
                                height: size,
                                width: size,
                                transform: `rotate(${flipped ? '-0.25' : '0.25'}turn)`,
                            }}
                            className="board flex outline-8 outline-black"
                            onClick={resetSquareHues}
                        >
                            {game.board.squares.map((row) => (
                                <div style={{ height: '12.5%', width: '12.5%' }}>
                                    {row.map((square) => {
                                        const evenCol = square.col % 2 === 1
                                        const evenRow = square.row % 2 === 1

                                        const dark = evenRow ? evenCol : !evenCol

                                        const piece = square.piece

                                        return (
                                            <Square id={`square-${square.col}-${square.row}`} dark={dark}>
                                                {piece && (
                                                    <div
                                                        // @ts-ignore
                                                        ref={drag}
                                                        className="unselectable h-fit w-fit cursor-move"
                                                        style={{
                                                            WebkitTextStroke: `0.5px ${piece.color == 'white' ? 'black' : 'white'}`,
                                                            WebkitTextFillColor: piece.color,
                                                            fontSize: size / 12,
                                                            transform: `rotate(${flipped ? '0.25' : '-0.25'}turn)`,
                                                        }}
                                                    >
                                                        {getPieceCharacter(piece)}
                                                    </div>
                                                )}
                                            </Square>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    </DndProvider>
                    <Button
                        type="button"
                        onClick={() => setFlipped(!flipped)}
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
        </>
    )
}
