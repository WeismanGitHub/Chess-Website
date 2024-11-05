import { useDroppable } from '@dnd-kit/core'
import React from 'react'

interface Props {
    col: number
    row: number
    children: any
}

export default function ({ col, row, children }: Props) {
    const { isOver, setNodeRef } = useDroppable({
        id: `${col}${row}`,
    })

    const evenCol = col % 2 === 1
    const evenRow = row % 2 === 1

    const dark = evenRow ? evenCol : !evenCol

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

                        e.currentTarget.style.backgroundColor = isInvisible
                            ? 'rgb(240 82 82 / 0.85)'
                            : 'transparent'
                    }}
                />
            </div>
        </>
    )
}
