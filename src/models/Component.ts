import { Model, Schema, model, models } from 'mongoose'
import { ObjectId } from 'mongodb'

interface ITrigger {}

interface IAction {}

interface IComponent {
    botId: typeof ObjectId
    triggers: [ITrigger]
    actions: [IAction]
}

type ComponentModel = Model<IComponent, {}>

const componentSchema = new Schema<IComponent, ComponentModel>(
    {
        botId: {
            type: ObjectId,
            required: [true, 'Please provide a bot Id.'],
            index: true,
        },
        triggers: {
            type: [{}],
            maxlength: [100, 'Cannot have more than 100 triggers.'],
        },
        actions: {
            type: [{}],
            maxlength: [100, 'Cannot have more than 100 actions.'],
        },
    },
    { timestamps: false }
)

export default (models.Components ||
    model<IComponent, ComponentModel>('Components', componentSchema)) as ComponentModel
