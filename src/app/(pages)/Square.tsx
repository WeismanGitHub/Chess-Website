import { Piece } from '../../lib/chess/pieces'
import { PieceElement } from './Piece'
import { useDrop } from 'react-dnd'
import type { FC } from 'react'
import { memo } from 'react'

interface SquareProps {
    piece: Piece | null
    onDrop: (item: any) => void
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
    let backgroundColor = '#222'

    if (isActive) {
        backgroundColor = 'darkgreen'
    } else if (canDrop) {
        backgroundColor = 'darkkhaki'
    }

    const evenCol = col % 2 === 1
    const evenRow = row % 2 === 1

    const dark = evenRow ? evenCol : !evenCol

    return (
        <div
            // @ts-ignore
            ref={drop}
            onContextMenu={(e) => {
                e.preventDefault()

                e.currentTarget.style.filter =
                    e.currentTarget.style.filter === 'hue-rotate(0deg)'
                        ? 'hue-rotate(150deg)'
                        : 'hue-rotate(0deg)'
            }}
            id={`square-${col}-${row}`}
            style={{
                width: '12.5%',
                height: '12.5%',
                backgroundColor: dark ? '#0e7490' : '#e8f2f5',
                filter: `${isActive ? 'hue-rotate(30deg)' : 'hue-rotate(0deg)'}`,
            }}
            className="flex justify-center align-middle"
        >
            {piece && <PieceElement col={col} piece={piece} row={row} type="piece" />}
        </div>
    )
})
