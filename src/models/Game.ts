import { Model, Schema, model, models, Types } from 'mongoose'

interface IGame {
    status: GameStatus
    moves: Move[]
    white: typeof Types.ObjectId
    black: typeof Types.ObjectId
}

type Move = {}

interface IUserMethods {
    isValidPassword(password: string): Promise<boolean>
    hashPassword(): Promise<void>
}

type GameModel = Model<IGame, {}, IUserMethods>

const gameschema = new Schema<IGame, GameModel, IUserMethods>(
    {
        status: {
            type: Number,
            enum: GameStatus,
            required: [true, 'Please provide a status.'],
            default: GameStatus.Active,
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

export default (models.Games || model<IGame, GameModel>('Games', gameschema)) as GameModel
