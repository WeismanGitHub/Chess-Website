import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import env from './env'

export function signAuthJwt(userId: string) {
    return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRATION })
}

export function getUserId(request: NextRequest): string {
    const value = request.cookies.get('auth')?.value

    if (!value) {
        throw new Error('Could not read auth cookie.')
    }

    // @ts-ignore
    const userId = jwt.decode(value)?.userId

    if (!userId) {
        throw new Error('Could not decode auth jwt.')
    }

    return userId
}

export function decodeAuthJwt(value: string): string {
    // @ts-ignore
    const userId = jwt.decode(value)?.userId

    if (!userId) {
        throw new Error('Could not decode auth jwt.')
    }

    return userId
}
