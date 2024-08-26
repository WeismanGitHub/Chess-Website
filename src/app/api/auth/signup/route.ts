import { errorHandler } from '../../../../lib/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { credentialsSchema } from '../../../../lib/zod'
import { ApiError } from 'next/dist/server/api-utils'
import dbConnect from '../../../../lib/dbConnect'
import { StatusCodes } from 'http-status-codes'
import { signAuthJwt } from '../../../../lib/jwt'
import { User } from '../../../../models'
import { cookies } from 'next/headers'
import { Error } from 'mongoose'

type body = {
    name: string | undefined
    password: string | undefined
}

async function endpoint(req: NextRequest) {
    const body: body = await req.json().catch(() => {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot parse request body.')
    })

    const { name, password } = await credentialsSchema.parseAsync(body)

    await dbConnect()

    const user = await User.create({
        name,
        password,
    }).catch((error) => {
        if (error instanceof Error.ValidationError) {
            for (const err of Object.values(error.errors)) {
                if (err.kind === 'unique') {
                    throw new ApiError(StatusCodes.CONFLICT, 'Name must be unique.')
                } else {
                    throw new ApiError(StatusCodes.BAD_REQUEST, 'A validation error occurred.')
                }
            }
        }

        throw error
    })

    cookies().set('auth', signAuthJwt(user.id), { httpOnly: true, sameSite: true, secure: true })

    return NextResponse.json({}, { status: StatusCodes.CREATED })
}

export const POST = errorHandler(endpoint)
