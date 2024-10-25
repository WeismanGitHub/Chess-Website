import type { CSSProperties, FC } from 'react'
import { Piece } from '../../lib/chess/pieces'
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

export interface BoxProps {
    piece: Piece
}

export const Box: FC<BoxProps> = memo(function Box({ piece }) {
    const [{ opacity }, drag] = useDrag(
        () => ({
            type: '',
            item: piece,
            collect: (monitor) => ({
                opacity: monitor.isDragging() ? 0.4 : 1,
            }),
        }),
        [piece]
    )

    return (
        // @ts-ignore
        <div ref={drag} style={{ ...style, opacity }} data-testid="box">
            {piece.constructor.name}
        </div>
    )
})
