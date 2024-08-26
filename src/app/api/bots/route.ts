import { NextRequest, NextResponse } from 'next/server'
import { errorHandler } from '../../../lib/middleware'
import { ApiError } from 'next/dist/server/api-utils'
import { BotConstants } from '../../../lib/constants'
import { StatusCodes } from 'http-status-codes'
import dbConnect from '../../../lib/dbConnect'
import { Bot } from '../../../models'
import { z } from 'zod'

type body = {
    name: string | undefined
}

const botSchema = z.object({
    name: z
        .string({ required_error: 'Name is required' })
        .min(BotConstants.minNameLength, `Name must be more than ${BotConstants.minNameLength} character(s)`)
        .max(
            BotConstants.maxNameLength,
            `Name cannot be more than be more than ${BotConstants.maxNameLength} character(s)`
        ),
})

async function endpoint(req: NextRequest) {
    const body: body = await req.json().catch(() => {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot parse request body.')
    })

    const { name } = await botSchema.parseAsync(body)

    await dbConnect()

    await Bot.create({
        name,
    })

    return NextResponse.json({}, { status: StatusCodes.CREATED })
}

export const POST = errorHandler(endpoint)
