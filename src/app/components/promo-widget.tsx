import { Bishop, Knight, Piece, Queen, Rook } from '../../lib/chess/pieces'
import { ListGroup, Modal } from 'flowbite-react'
import characterFont from './character-font'
import { Color } from '../../types'
import { Game } from '../../lib/chess'

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
    const turn = game.turn
    const classes = [Queen, Bishop, Knight, Rook]

    return (
        <Modal show={true} onClose={handleClose} dismissible autoFocus>
            <ListGroup>
                {classes.map((c) => {
                    const piece = new c(game.turn)

                    return (
                        <ListGroup.Item onClick={() => handleSelect(piece)} active>
                            <PieceIcon piece={piece} turn={turn} />
                        </ListGroup.Item>
                    )
                })}
            </ListGroup>
        </Modal>
    )
}
