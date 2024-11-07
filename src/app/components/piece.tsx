import { Piece } from '../../lib/chess/pieces'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import localFont from 'next/font/local'
import React from 'react'

const chessFont = localFont({
    src: './chess-font.ttf',
    display: 'swap',
})

export default function ({ piece, id, size }: { piece: Piece; id: string; size: number }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id,
    })

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className="unselectable piece h-fit w-fit cursor-grab"
            style={{
                transform: CSS.Translate.toString(transform),
                WebkitTextFillColor: piece.color === 'white' ? '#aab1b3' : '#011217',
                fontSize: size / 12,
                zIndex: isDragging ? 100 : 1,
                ...chessFont.style,
            }}
        >
            {piece.character}
        </div>
    )
}
