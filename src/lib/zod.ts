import { LobbyConstants, UserConstants } from './constants'
import { number, object, string, z } from 'zod'

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

export const createLobbySchema = object({
    minutes: number({ required_error: 'Minutes are required' })
        .min(1, `Minutes must be more than 1`)
        .max(240, `Minutes cannot be more than 240`),
})

export const joinLobbySchema = object({
    id: z.literal(LobbyConstants.idLength),
})

export const messageSchema = string({ required_error: 'Message is required' })
    .min(1, `Message must be more than 1 character`)
    .max(1000, `Message cannot be more than be more than 1000 characters`)
