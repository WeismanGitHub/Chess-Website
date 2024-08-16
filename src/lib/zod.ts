import { object, string } from 'zod'

export const signInSchema = object({
    name: string({ required_error: 'Name is required' }).min(1).max(25),
    password: string({ required_error: 'Password is required' }).min(10),
})
