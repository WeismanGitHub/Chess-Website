import { Model, Schema, model, models, Types } from 'mongoose'
import { GameState } from '../types'
import { Game } from '../lib/chess/'

interface IGame {
    status: GameState
    moves: Move[]
    white: typeof Types.ObjectId
    black: typeof Types.ObjectId
}

type Move = {}

interface IGameMethods {
    constructGame(): Game
}

type GameModel = Model<IGame, {}, IGameMethods>

const gameschema = new Schema<IGame, GameModel, IGameMethods>(
    {
        status: {
            type: Number,
            enum: GameState,
            required: [true, 'Please provide a status.'],
            default: GameState.Active,
        },
        moves: {
            type: [],
            required: true,
            default: [],
        },
        white: {
            type: Types.ObjectId,
            required: true,
        },
        black: {
            type: Types.ObjectId,
            required: true,
        },
    },
    { timestamps: { createdAt: true, updatedAt: true } }
)

gameschema.method('constructGame', function constructGame() {
    return new Game()
})

export default (models.Games || model<IGame, GameModel>('Games', gameschema)) as GameModel
