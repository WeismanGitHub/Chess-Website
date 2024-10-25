import { Bishop, King, Knight, Pawn, Piece, Queen, Rook } from '../../lib/chess/pieces'
import { useDrop } from 'react-dnd'
import type { FC } from 'react'
import { memo } from 'react'

interface DustbinProps {
    accept: string[]
    piece: Piece | null
    onDrop: (item: any) => void
    row: number
    col: number

    flipped: boolean
    size: number
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

export const Dustbin: FC<DustbinProps> = memo(function Dustbin({
    accept,
    piece,
    onDrop,
    col,
    row,
    flipped,
    size,
}) {
    const [{ isOver, canDrop }, drop] = useDrop({
        accept,
        drop: onDrop,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
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
                filter: 'hue-rotate(0deg)',
            }}
            className="flex justify-center align-middle"
        >
            {piece && (
                <div
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
        </div>
        // // @ts-ignore
        // <div ref={drop} style={{ ...style, backgroundColor }} data-testid="dustbin">
        //     {isActive ? 'Release to drop' : `This dustbin accepts: ${accept.join(', ')}`}

        //     {lastDroppedItem && <p>Last dropped: {JSON.stringify(lastDroppedItem)}</p>}
        // </div>
    )
})
