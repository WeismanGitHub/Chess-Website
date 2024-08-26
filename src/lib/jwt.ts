import { ApiError } from 'next/dist/server/api-utils'
import { StatusCodes } from 'http-status-codes'
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import env from './env'

export function signAuthJwt(userId: string) {
    return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRATION })
}

export function decodeAuthJwt(request: NextRequest): string {
    const value = request.cookies.get('auth')?.value

    if (!value) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Could not read auth cookie.')
    }

    // @ts-ignore
    const userId = jwt.decode(value)?.userId

    if (!userId) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Could not decode auth jwt.')
    }

    return userId
}
