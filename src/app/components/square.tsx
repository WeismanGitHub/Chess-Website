import { useDroppable } from '@dnd-kit/core'
import React, { useEffect } from 'react'

interface Props {
    col: number
    row: number
    children: any
    showFile: boolean
    showRow: boolean
}

export const Colors = {
    over: 'rgb(209 213 219 / 0.70)',
    highlight: 'rgb(240 82 82 / 0.85)',
}

export default function ({ col, row, children, showFile, showRow }: Props) {
    const { isOver, setNodeRef } = useDroppable({
        id: `${col} ${row}`,
    })

    const evenCol = col % 2 === 1
    const evenRow = row % 2 === 1

    const dark = evenRow ? !evenCol : evenCol

    useEffect(() => {
        const overlay = document.getElementById(`overlay-${col}${row}`)!

        if (isOver) {
            overlay.style.border = `${Colors.over} 3px solid`
        } else {
            overlay.style.border = 'transparent'
        }
    }, [isOver])

    return (
        <>
            <div
                ref={setNodeRef}
                id={`square-${col}${row}`}
                style={{
                    width: '12.5%',
                    height: '12.5%',
                    backgroundColor: dark ? '#0e7490' : '#e8f2f5',
                    position: 'relative',
                }}
                className="flex justify-center align-middle"
            >
                <div
                    aria-hidden
                    style={{ color: dark ? '#e8f2f5' : '#0e7490', zIndex: 50 }}
                    className="unselectable text-xs"
                >
                    {showRow && <strong className="absolute bottom-0 right-0 m-1">{'HGFEDCBA'[col]}</strong>}
                    {showFile && <strong className="absolute left-0 top-0 m-1">{row + 1}</strong>}
                </div>
                {children}
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        backgroundColor: 'transparent',
                    }}
                    aria-hidden
                    id={`overlay-${col}${row}`}
                    onContextMenu={(e) => {
                        e.preventDefault()

                        const isInvisible = e.currentTarget.style.backgroundColor == 'transparent'

                        e.currentTarget.style.backgroundColor = isInvisible ? Colors.highlight : 'transparent'
                    }}
                />
            </div>
        </>
    )
}
