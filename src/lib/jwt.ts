import jwt from 'jsonwebtoken'
import env from './env'

export function signJwt(userId: string) {
    return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRATION })
}
