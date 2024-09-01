import { Model, Schema, model, models } from 'mongoose'
import { ITrigger } from './triggers'
import { ObjectId } from 'mongodb'
import { IBlock } from './blocks'

interface IComponent {
    botId: typeof ObjectId
    trigger: ITrigger
    flow: [IBlock]
}

type ComponentModel = Model<IComponent, {}>

const componentSchema = new Schema<IComponent, ComponentModel>(
    {
        botId: {
            type: ObjectId,
            required: [true, 'Please provide a bot Id.'],
            index: true,
        },
        trigger: {
            type: {},
        },
        flow: {
            type: [{}],
        },
    },
    { timestamps: false }
)

export default (models.Components ||
    model<IComponent, ComponentModel>('Components', componentSchema)) as ComponentModel
