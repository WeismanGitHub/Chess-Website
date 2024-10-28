import { Piece } from '../../lib/chess/pieces'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import React from 'react'

export default function ({ piece, id }: { piece: Piece; id: string }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
    })

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className="unselectable h-fit w-fit cursor-grab"
            style={{
                transform: CSS.Translate.toString(transform),
                WebkitTextStroke: `0.5px ${piece.color == 'white' ? 'black' : 'white'}`,
                WebkitTextFillColor: piece.color,
                fontSize: 30,
                zIndex: 100,
            }}
        >
            {piece.character}
        </div>
    )
}
