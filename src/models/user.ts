import mongoose from 'mongoose'

export interface Users extends mongoose.Document {
    name: string
}

const UserSchema = new mongoose.Schema<Users>({
    name: {
        type: String,
        required: [true, 'Please provide a name.'],
        maxlength: [25, 'Name cannot be more than 25 characters.'],
    },
})

export default mongoose.models.Users || mongoose.model<Users>('Users', UserSchema)
