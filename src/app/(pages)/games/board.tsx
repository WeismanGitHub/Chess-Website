'use client'

import { King, Piece, Queen, Pawn, Bishop, Rook, Knight } from '../../../lib/chess/pieces'
import React, { ReactNode, useEffect, useState } from 'react'
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

export default function Board() {
    const game = new Game()

    const [isMounted, setIsMounted] = useState(false)
    const [size, setSize] = useState(0)

    function updateWidth() {
        if (window.innerHeight > window.innerWidth) {
            // vertical screen
            const width = window.innerWidth * 0.8
            setSize(width > 320 ? width : 320)
        } else {
            // horizontal screen
            const width = window.innerHeight * 0.8
            setSize(width > 320 ? width : 320)
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
                <div className="flex h-fit w-fit flex-row align-top">
                    <div
                        style={{ height: size, width: size, transform: 'rotate(-0.25turn)' }}
                        className={`flex ${size > 320 ? 'outline' : ''} outline-8 outline-black`}
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
                                                    className="unselectable h-fit w-fit cursor-grab"
                                                    style={{
                                                        WebkitTextStroke: `0.5px ${piece.color == 'white' ? 'black' : 'white'}`,
                                                        WebkitTextFillColor: piece.color,
                                                        fontSize: size / 12,
                                                        transform: 'rotate(0.25turn)',
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

                </div>
            )}
        </>
    )
}
