'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import { Game } from '../../../lib/chess'

function Square({ dark = false, children = undefined }: { dark?: boolean; children?: ReactNode }) {

    return (
        <div style={{ width: '100%', height: '100%', backgroundColor: dark ? '#0e7490' : '#e8f2f5' }}>
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
                <div
                    style={{ height: size, width: size }}
                    className={`flex ${size > 320 ? 'outline' : ''} outline-8 outline-black`}
                >
                    {game.board.squares.map((row) => (
                        <div className="flex-row" style={{ height: '12.5%', width: '12.5%' }}>
                            {row.map((square) => {
                                const evenCol = square.col % 2 === 1
                                const evenRow = square.row % 2 === 1

                                return <Square dark={evenRow ? !evenCol : evenCol} />
                            })}
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}
