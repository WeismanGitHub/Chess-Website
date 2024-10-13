import { UserConstants } from './constants'
import { number, object, string } from 'zod'

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

export const lobbySchema = object({
    name: string({ required_error: 'Name is required' })
        .min(1, `Name must be more than 1 character`)
        .max(50, `Name cannot be more than be more than 50 characters`),
    password: string({ required_error: 'Password is required' })
        .min(1, `Password must be more than 1 character`)
        .max(50, `Password cannot be more than be more than 50 characters`),
    minutes: number({ required_error: 'Minutes are required' })
        .min(1, `Minutes must be more than 1`)
        .max(240, `Minutes cannot be more than 240`),
})
