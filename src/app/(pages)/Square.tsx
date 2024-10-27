import { Piece } from '../../lib/chess/pieces'
import { PieceElement } from './Piece'
import { useDrop } from 'react-dnd'
import type { FC } from 'react'
import { memo } from 'react'

interface SquareProps {
    piece: Piece | null
    onDrop: (...item: any) => void
    row: number
    col: number
}

export const SquareElement: FC<SquareProps> = memo(function ({ piece, onDrop, col, row }) {
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: ['piece'],
        drop: onDrop,
        collect: (monitor) => {
            return {
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
            }
        },
    })

    const isActive = isOver && canDrop

    const evenCol = col % 2 === 1
    const evenRow = row % 2 === 1

    const dark = evenRow ? evenCol : !evenCol

    return (
        <>
            <div
                // @ts-ignore
                ref={drop}
                onContextMenu={(e) => {
                    e.preventDefault()

                    const overlay = document.getElementById(`overlay-${col}-${row}`)!
                    overlay.hidden = false
                }}
                id={`square-${col}-${row}`}
                style={{
                    width: '12.5%',
                    height: '12.5%',
                    backgroundColor: dark ? '#0e7490' : '#e8f2f5',
                    position: 'relative',
                }}
                className="flex justify-center align-middle"
            >
                {piece && <PieceElement col={col} piece={piece} row={row} />}

                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        backgroundColor: `rgb(${isActive ? '14 159 110' : '240 82 82'} / 0.85)`,
                    }}
                    hidden
                    aria-hidden
                    id={`overlay-${col}-${row}`}
                    onContextMenu={(e) => {
                        e.preventDefault()
                        console.log(e)

                        const invisible = 'rgb(0 0 0 / 0)'
                        e.currentTarget.style.backgroundColor = invisible
                    }}
                />
            </div>
        </>
    )
})
