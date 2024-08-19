import { UserConstants } from './constants'
import { object, string } from 'zod'

export const credentialsSchema = object({
    name: string({ required_error: 'Name is required' })
        .min(UserConstants.MinNameLength)
        .max(UserConstants.MaxNameLength),
    password: string({ required_error: 'Password is required' }).min(UserConstants.MinPasswordLength),
})
