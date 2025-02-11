import { Bishop, Knight, Piece, Queen, Rook } from '../../lib/chess/pieces'
import { Button, Modal } from 'flowbite-react'
import characterFont from './character-font'
import { Game } from '../../lib/chess'
import { Color } from '../../types'

function PieceIcon({ turn, piece }: { turn: Color; piece: Piece }) {
    return (
        <div
            className="unselectable piece h-fit w-fit"
            style={{
                WebkitTextFillColor: turn === 'white' ? '#aab1b3' : '#011217',
                fontSize: 30,
                ...characterFont.style,
            }}
        >
            {piece.character}
        </div>
    )
}

export default function PromotionWidget({
    handleSelect,
    game,
    handleClose,
}: {
    handleSelect: (piece: Piece) => void
    game: Game
    handleClose: () => void
}) {
    const classes = [Queen, Bishop, Knight, Rook]

    return (
        <Modal show={true} onClose={handleClose} dismissible autoFocus>
            <Modal.Body>
                <div className="flex justify-center bg-transparent">
                    <Button.Group className="flex">
                        {classes.map((c) => {
                            const piece = new c(game.turn)

                            return (
                                <Button onClick={() => handleSelect(piece)}>
                                    <PieceIcon piece={piece} turn={game.turn} />
                                </Button>
                            )
                        })}
                    </Button.Group>
                </div>
            </Modal.Body>
        </Modal>
    )
}
