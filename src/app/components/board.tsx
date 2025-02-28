'use client'

import { restrictToWindowEdges, snapCenterToCursor } from '@dnd-kit/modifiers'
import { DndContext, UniqueIdentifier } from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { makeAutoObservable } from 'mobx'
import { Button } from 'flowbite-react'

import { Pawn, Piece } from '../../lib/chess/pieces'
import PromotionWidget from './promo-widget'
import Square from '../../lib/chess/square'
import { Game } from '../../lib/chess/'
import DroppableSquare from './square'
import DraggablePiece from './piece'

export function setBackgroundColor(id: string, value: string) {
    const square = document.getElementById(id)

    if (square) {
        square.style.backgroundColor = value
    }
}

export function resetOverlays() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            setBackgroundColor(`overlay-${i}${j}`, 'transparent')
        }
    }
}

function parsePieceId(id: UniqueIdentifier): [string, number, number] {
    const [name, col, row] = id.toString().split(' ')

    return [name, Number(col), Number(row)]
}

function parseSquareId(id: UniqueIdentifier): [number, number] {
    const [col, row] = id.toString().split(' ')

    return [Number(col), Number(row)]
}

function createReadableSquare(id: UniqueIdentifier): string {
    const [col, row] = parseSquareId(id)

    return createReadablePosition(col, row)
}

function createReadablePiece(id: UniqueIdentifier): string {
    const [name, col, row] = parsePieceId(id)

    return `${createReadablePosition(col, row)} ${name}`
}

function createReadablePosition(col: number, row: number): string {
    const letters = 'HGFEDCBA'

    return `${letters[col]}${row + 1}`
}

const games: Game[] = []
let game = makeAutoObservable(new Game())

export default function ({ size }: { size: number }) {
    const [promoMove, setPromoMove] = useState<[Square, Square] | null>(null)

    const [showNotation, setShowNotation] = useState(true)
    const [reversed, setReversed] = useState(false)

    useEffect(() => {
        if (!localStorage.getItem('showNotation')) {
            localStorage.setItem('showNotation', 'yes')
            setShowNotation(true)
        } else {
            setShowNotation(localStorage.getItem('showNotation') === 'yes')
        }
    }, [])

    function handleMove(start: Square, end: Square, promotion?: Piece, callback?: Function) {
        let gameCopy = new Game()

        const copiedSquares: Square[][] = []

        for (let i = 0; i < 8; i++) {
            copiedSquares[i] = []

            for (let j = 0; j < 8; j++) {
                const piece = game.board.squares[i][j].piece

                copiedSquares[i][j] = new Square(i, j, piece && Object.create(piece))
            }
        }

        gameCopy.board.squares = copiedSquares
        gameCopy.turn = game.turn
        game.state = game.state

        try {
            game.makeMove(start, end, promotion)

            // send move to server and then update client

            callback?.()

            games.push(gameCopy)
        } catch (err) {
            console.log(err)
        }
    }

    const BoardView = observer(({ game }: { game: Game }) => {
        const squares = game.board.squares.flat().toReversed()

        if (reversed) {
            squares.reverse()
        }

        return (
            <div>
                <div hidden>{game.turn}</div>
                <DndContext
                    modifiers={[restrictToWindowEdges, snapCenterToCursor]}
                    accessibility={{
                        screenReaderInstructions: {
                            draggable:
                                'To pick up a piece, press space or enter. While dragging, use the arrow keys to move the piece in any given direction. Press space or enter again to drop the piece in its new square, or press escape to cancel.',
                        },
                        announcements: {
                            onDragStart({ active }) {
                                return `Picked up ${createReadablePiece(active.id)}.`
                            },
                            onDragOver({ active, over }) {
                                if (over) {
                                    return `${createReadablePiece(active.id)} was moved over ${createReadableSquare(over.id)}.`
                                }

                                return `${createReadablePiece(active.id)} is no longer over a square.`
                            },
                            onDragEnd({ active, over }) {
                                if (over) {
                                    return `${createReadablePiece(active.id)} was dropped over ${createReadableSquare(over.id)}`
                                }

                                return `${createReadablePiece(active.id)} was dropped.`
                            },
                            onDragCancel({ active }) {
                                return `Dragging was cancelled. ${createReadablePiece(active.id)} was dropped.`
                            },
                        },
                    }}
                    onDragEnd={({ active, over }) => {
                        if (!over) return

                        const [_, activeCol, activeRow] = parsePieceId(active.id)
                        const [overCol, overRow] = parseSquareId(over.id)

                        let piece = game.board.squares
                            .flat()
                            .find((square) => square.col == activeCol && square.row == activeRow)?.piece!

                        const start = game.board.getSquare(activeRow, activeCol)! as Square & { piece: Piece }
                        const end = game.board.getSquare(overRow, overCol)!

                        if (
                            piece instanceof Pawn &&
                            (piece.color === 'white' ? end.row === 7 : end.row === 0)
                        ) {
                            return setPromoMove([start, end])
                        }

                        handleMove(start, end)
                    }}
                >
                    <div
                        style={{
                            height: size,
                            width: size,
                        }}
                        className="board flex flex-wrap rounded shadow-lg"
                        onClick={resetOverlays}
                    >
                        {squares.map(({ col, row, piece }) => {
                            const showFiles = showNotation && col === (reversed ? 0 : 7)
                            const showRows = showNotation && row === (reversed ? 7 : 0)

                            return (
                                <DroppableSquare
                                    showFile={showFiles}
                                    showRow={showRows}
                                    key={`${col}${row}`}
                                    col={col}
                                    row={row}
                                >
                                    {piece && (
                                        <DraggablePiece
                                            size={size}
                                            key={`${col}${row}`}
                                            piece={piece}
                                            col={col}
                                            row={row}
                                        />
                                    )}
                                </DroppableSquare>
                            )
                        })}
                    </div>
                </DndContext>
            </div>
        )
    })

    return (
        <>
            {promoMove && (
                <PromotionWidget
                    handleSelect={(piece) => {
                        handleMove(promoMove[0], promoMove[1], piece, () => {
                            promoMove[1].piece = piece

                            setPromoMove(null)
                        })
                    }}
                    handleClose={() => {
                        setPromoMove(null)
                    }}
                    game={game}
                />
            )}
            <div className="flex h-fit w-fit flex-col-reverse items-center gap-2 md:flex-row">
                <div className="flex flex-row gap-2 md:flex-col">
                    <Button
                        // @ts-ignore
                        onClick={() => {
                            setReversed(!reversed)
                        }}
                        className="inline-flex items-center rounded-lg text-center text-sm font-medium text-white"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z" />
                        </svg>
                        <span className="sr-only">reverse board</span>
                    </Button>
                    <Button
                        onClick={() => {
                            localStorage.setItem('showNotation', !showNotation ? 'yes' : 'no')
                            setShowNotation(!showNotation)
                        }}
                        className="items-center rounded-lg text-center text-sm font-medium text-white"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            className="h-4 w-4 scale-125"
                            viewBox="0 0 16 16"
                        >
                            <path d="M1.226 10.88H0l2.056-6.26h1.42l2.047 6.26h-1.29l-.48-1.61H1.707l-.48 1.61ZM2.76 5.818h-.054l-.75 2.532H3.51zm3.217 5.062V4.62h2.56c1.09 0 1.808.582 1.808 1.54 0 .762-.444 1.22-1.05 1.372v.055c.736.074 1.365.587 1.365 1.528 0 1.119-.89 1.766-2.133 1.766zM7.18 5.55v1.675h.8c.812 0 1.171-.308 1.171-.853 0-.51-.328-.822-.898-.822zm0 2.537V9.95h.903c.951 0 1.342-.312 1.342-.909 0-.591-.382-.954-1.095-.954zm5.089-.711v.775c0 1.156.49 1.803 1.347 1.803.705 0 1.163-.454 1.212-1.096H16v.12C15.942 10.173 14.95 11 13.607 11c-1.648 0-2.573-1.073-2.573-2.849v-.78c0-1.775.934-2.871 2.573-2.871 1.347 0 2.34.849 2.393 2.087v.115h-1.172c-.05-.665-.516-1.156-1.212-1.156-.849 0-1.347.67-1.347 1.83" />
                        </svg>
                        <span className="sr-only">toggle notation</span>
                    </Button>
                    <Button
                        onClick={() => {
                            game = makeAutoObservable(games[games.length - 1] ?? new Game())
                            games.pop()

                            // To make it re-render
                            setShowNotation(!showNotation)
                            setTimeout(() => {
                                setShowNotation(showNotation)
                            }, 0)
                        }}
                    >
                        {'<'}
                    </Button>
                </div>

                <BoardView game={game} />
            </div>
        </>
    )
}
