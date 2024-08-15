import { Model, Schema, model, models } from 'mongoose'
import { compare, hash } from 'bcrypt'

interface IUser {
    username: string
    password: string
}

interface IUserMethods {
    isValidPassword(password: string): Promise<boolean>
    hashPassword(): Promise<void>
}

type UserModel = Model<IUser, {}, IUserMethods>

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
    {
        username: {
            type: String,
            required: [true, 'Please provide a username.'],
            maxlength: [25, 'Username cannot be more than 25 characters.'],
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

userSchema.method('hashPassword', async function hashPassword() {
    const hashedPassword = await hash(this.password, 10)
    this.password = hashedPassword
})

userSchema.pre('save', async function (next) {
    const hashedPassword = await hash(this.password, 10)
    this.password = hashedPassword

    next()
})

export default models.Users || model<IUser, UserModel>('Users', userSchema)
