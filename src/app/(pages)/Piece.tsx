import { Bishop, King, Knight, Pawn, Piece, Queen, Rook } from '../../lib/chess/pieces'
import { useDrag } from 'react-dnd'
import type { FC } from 'react'
import { memo } from 'react'

export interface PieceProps {
    piece: Piece
    row: number
    col: number
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

export const PieceElement: FC<PieceProps> = memo(function Box({ piece, col, row }) {
    const [{ opacity }, drag] = useDrag(
        () => ({
            type: 'piece',
            item: { piece, col, row },
            collect: (monitor) => ({
                opacity: monitor.isDragging() ? 0 : 1,
            }),
        }),
        [piece, col, row]
    )

    return (
        <div
            // @ts-ignore
            ref={drag}
            className="unselectable h-fit w-fit cursor-grab"
            style={{
                WebkitTextStroke: `0.5px ${piece.color == 'white' ? 'black' : 'white'}`,
                WebkitTextFillColor: piece.color,
                fontSize: 30,
                transform: `rotate(${true ? '0.25' : '-0.25'}turn)`,
                opacity,
                zIndex: 100,
            }}
        >
            {getPieceCharacter(piece)}
        </div>
    )
})
