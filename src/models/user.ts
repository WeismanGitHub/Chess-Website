import { Model, Schema, model, models } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { UserConstants } from '../lib/constants'
import { compare, hash } from 'bcrypt'

interface IUser {
    name: string
    password: string
}

interface IUserMethods {
    isValidPassword(password: string): Promise<boolean>
    hashPassword(): Promise<void>
}

type UserModel = Model<IUser, {}, IUserMethods>

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name.'],
            minlength: [
                UserConstants.minNameLength,
                `Name cannot be less than ${UserConstants.minNameLength} character(s).`,
            ],
            maxlength: [
                UserConstants.maxNameLength,
                `Name cannot be more than ${UserConstants.maxNameLength} characters.`,
            ],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Please provide a password.'],
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
)

userSchema.method('isValidPassword', async function isValidPassword(password: string) {
    const isValid = await compare(password, this.password)

    return isValid
})

userSchema.pre('save', async function (next) {
    const hashedPassword = await hash(this.password, 10)
    this.password = hashedPassword

    next()
})

userSchema.plugin(uniqueValidator)

export default (models.Users || model<IUser, UserModel>('Users', userSchema)) as UserModel
