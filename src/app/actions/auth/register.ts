'use server'

import CustomError from '../../../lib/custom-error'
import { Error as MongooseError } from 'mongoose'
import { Credentials } from '../../../lib/zod'
import { signAuthJwt } from '../../../lib/jwt'
import errorHandler from '../error-handler'
import { cookies } from 'next/headers'
import { User } from '../../../models'

export default errorHandler(async (body) => {
    const { name, password } = await Credentials.parseAsync(body)

    const user = await User.create({
        name,
        password,
    }).catch((error) => {
        if (error instanceof MongooseError.ValidationError) {
            for (const err of Object.values(error.errors)) {
                if (err.kind === 'unique') {
                    throw new CustomError('Name must be unique.')
                } else {
                    throw new CustomError('A validation error occurred.')
                }
            }
        }

        throw error
    })

    cookies().set('auth', signAuthJwt(user.id), { httpOnly: true, sameSite: 'strict', secure: true })
})
