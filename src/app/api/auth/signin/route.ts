import { errorHandler } from '../../../../lib/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { ApiError } from 'next/dist/server/api-utils'
import dbConnect from '../../../../lib/dbConnect'
import { StatusCodes } from 'http-status-codes'
import { signJwt } from '../../../../lib/jwt'
import { User } from '../../../../models'
import { cookies } from 'next/headers'

type body = {
    name: string | undefined
    password: string | undefined
}

async function endpoint(req: NextRequest) {
    const { name, password }: body = await req.json().catch(() => {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot parse request body.')
    })

    if (!name || !password) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing credentials.')
    }

    await dbConnect()

    const user = await User.findOne({ name })

    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Could not find an account with that name.')
    }

    if (!user.isValidPassword(password)) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid password.')
    }

    cookies().set('auth', signJwt(user.id), { httpOnly: true, sameSite: true, secure: true })

    return NextResponse.json({}, { status: StatusCodes.OK })
}

export const POST = errorHandler(endpoint)
