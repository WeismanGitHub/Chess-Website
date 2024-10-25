import { Bishop, King, Knight, Pawn, Piece, Queen, Rook } from '../../lib/chess/pieces'
import type { CSSProperties, FC } from 'react'
import { useDrag } from 'react-dnd'
import { memo } from 'react'

const style: CSSProperties = {
    border: '1px dashed gray',
    backgroundColor: 'white',
    padding: '0.5rem 1rem',
    marginRight: '1.5rem',
    marginBottom: '1.5rem',
    cursor: 'move',
    float: 'left',
}

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

export const Box: FC<PieceProps> = memo(function Box({ piece, col, row }) {
    const [{ opacity }, drag] = useDrag(
        () => ({
            item: { piece, col, row },
            collect: (monitor) => ({
                opacity: monitor.isDragging() ? 0 : 1,
            }),
            type: 'piece',
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
            }}
        >
            {getPieceCharacter(piece)}
        </div>
    )
})
