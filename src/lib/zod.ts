import { UserConstants } from './constants'
import { object, string } from 'zod'

export const credentialsSchema = object({
    name: string({ required_error: 'Name is required' })
        .min(
            UserConstants.minNameLength,
            `Name must be more than ${UserConstants.minNameLength} character(s)`
        )
        .max(
            UserConstants.maxNameLength,
            `Name cannot be more than be more than ${UserConstants.maxNameLength} characters`
        ),
    password: string({ required_error: 'Password is required' }).min(
        UserConstants.minPasswordLength,
        `Password must be more than ${UserConstants.minPasswordLength} character(s)`
    ),
})
