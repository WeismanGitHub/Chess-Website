import { Piece } from '../../lib/chess/pieces'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import React, { useEffect } from 'react'
import localFont from 'next/font/local'
import { resetOverlays } from './board'
import { Colors } from './square'

const chessFont = localFont({
    src: './chess-font.ttf',
    display: 'swap',
})

export default function ({ piece, id, size }: { piece: Piece; id: string; size: number }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id,
    })

    useEffect(() => {
        resetOverlays()
    }, [isDragging])

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
            onContextMenu={(e) => {
                e.preventDefault()

                const overlay = e.currentTarget.parentNode?.querySelectorAll('div')?.[2]

                if (overlay && overlay.id.startsWith('overlay')) {
                    const isInvisible = overlay.style.backgroundColor == 'transparent'

                    overlay.style.backgroundColor = isInvisible ? Colors.highlight : 'transparent'
                }
            }}
        >
            {piece.character}
        </div>
    )
}
