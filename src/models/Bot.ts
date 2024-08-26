import { Model, Schema, model, models } from 'mongoose'
import { BotConstants } from '../lib/constants'

interface IBot {
    name: string
}

type BotModel = Model<IBot, {}>

const botSchema = new Schema<IBot, BotModel>(
    {
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

export default (models.Users || model<IBot, BotModel>('Bots', botSchema)) as BotModel
