import { Model, Schema, model, models } from 'mongoose'
import { BotConstants } from '../lib/constants'
import { ObjectId } from 'mongodb'

interface IBot {
    name: string
    userId: typeof ObjectId
}

type BotModel = Model<IBot, {}>

const botSchema = new Schema<IBot, BotModel>(
    {
        userId: {
            type: ObjectId,
            required: [true, 'Please provide a user Id.'],
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Please provide a name.'],
            minlength: [
                BotConstants.minNameLength,
                `Name cannot be less than ${BotConstants.minNameLength} character(s).`,
            ],
            maxlength: [
                BotConstants.maxNameLength,
                `Name cannot be more than ${BotConstants.maxNameLength} characters.`,
            ],
        },
    },
    { timestamps: true }
)

export default (models.Bots || model<IBot, BotModel>('Bots', botSchema)) as BotModel
