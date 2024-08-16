import { Model, Schema, model, models } from 'mongoose'
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
            maxlength: [25, 'Name cannot be more than 25 characters.'],
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

export default (models.Users || model<IUser, UserModel>('Users', userSchema)) as UserModel
