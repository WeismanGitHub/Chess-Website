import { Bishop, Knight, Piece, Queen, Rook } from '../../lib/chess/pieces'
import { ListGroup, Modal } from 'flowbite-react'
import characterFont from './character-font'
import { Color } from '../../types'

function PieceIcon({ turn, piece }: { turn: Color; piece: Piece }) {
    return (
        <div
            className="unselectable piece h-fit w-fit"
            style={{
                WebkitTextFillColor: turn === 'white' ? '#aab1b3' : '#011217',
                fontSize: 12,
                ...characterFont.style,
            }}
        >
            {piece.character}
        </div>
    )
}

export default function PromotionWidget({
    handleSelect,
    turn,
    handleClose,
}: {
    handleSelect: (piece: Piece) => void
    turn: Color
    handleClose: () => void
}) {
    return (
        <Modal show={true} position={'center'} onClose={handleClose} dismissible autoFocus>
            <Modal.Header />
            <Modal.Body>
                <div className="p-6">
                    <ListGroup>
                        <ListGroup.Item href="#" active>
                            <PieceIcon piece={new Queen()} turn={turn} />
                            <PieceIcon piece={new Bishop()} turn={turn} />
                            <PieceIcon piece={new Knight()} turn={turn} />
                            <PieceIcon piece={new Rook()} turn={turn} />
                        </ListGroup.Item>
                    </ListGroup>
                </div>
            </Modal.Body>
        </Modal>
    )
}
