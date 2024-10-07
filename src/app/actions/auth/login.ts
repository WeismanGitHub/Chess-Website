'use server'

import { credentialsSchema } from '../../../lib/zod'
import CustomError from '../../../lib/custom-error'
import dbConnect from '../../../lib/db-connect'
import { signAuthJwt } from '../../../lib/jwt'
import errorHandler from '../error-handler'
import { cookies } from 'next/headers'
import { User } from '../../../models'

export default errorHandler(async (body: { name: string; password: string }) => {
    const { name, password } = await credentialsSchema.parseAsync(body)

    await dbConnect()

    const user = await User.findOne({ name })

    if (!user) {
        throw new CustomError('Could not find an account with that name.')
    }

    if (!user.isValidPassword(password)) {
        throw new CustomError('That password is invalid.')
    }

    cookies().set('auth', signAuthJwt(user.id), { httpOnly: true, sameSite: true, secure: true })
})
