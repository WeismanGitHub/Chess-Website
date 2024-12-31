'use server'

import CustomError from '../../../lib/custom-error'
import { Credentials } from '../../../lib/zod'
import { signAuthJwt } from '../../../lib/jwt'
import errorHandler from '../error-handler'
import { cookies } from 'next/headers'
import { User } from '../../../models'

export default errorHandler(async (body) => {
    const { name, password } = await Credentials.parseAsync(body)

    const user = await User.findOne({ name })

    if (!user) {
        throw new CustomError('Could not find an account with that name.')
    }

    const isValidPassword = await user.isValidPassword(password)

    if (!isValidPassword) {
        throw new CustomError('That password is invalid.')
    }

    cookies().set('auth', signAuthJwt(user.id), { httpOnly: true, sameSite: true, secure: true })
})
