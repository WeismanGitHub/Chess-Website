import { RoomConstants, UserConstants } from './constants'
import { number, object, string } from 'zod'

export const Credentials = object({
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

export const minutesSchema = number({ required_error: 'Minutes are required' })
    .min(RoomConstants.minMinutesLength, `Minutes must be more than ${RoomConstants.minMinutesLength}`)
    .max(RoomConstants.maxMinutesLength, `Minutes cannot be more than ${RoomConstants.maxMinutesLength}`)

export const idSchema = string({ required_error: 'Id is required' }).length(
    RoomConstants.idLength,
    `Id must be ${RoomConstants.idLength} characters long`
)

export const messageSchema = string({ required_error: 'Message is required' })
    .min(1, `Message must be more than 1 character`)
    .max(1000, `Message cannot be more than be more than 1000 characters`)
