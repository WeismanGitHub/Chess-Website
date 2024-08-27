import { NextRequest, NextResponse } from 'next/server'
import { errorHandler } from '../../../lib/middleware'
import { ApiError } from 'next/dist/server/api-utils'
import { BotConstants } from '../../../lib/constants'
import { decodeAuthJwt } from '../../../lib/jwt'
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

async function createBot(req: NextRequest) {
    const body: body = await req.json().catch(() => {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot parse request body.')
    })

    const { name } = await botSchema.parseAsync(body)

    await dbConnect()

    const userId = decodeAuthJwt(req)

    const bot = await Bot.create({
        name,
        userId,
    })

    return NextResponse.json({ id: bot.id }, { status: StatusCodes.CREATED })
}

async function getBots(req: NextRequest) {
    const userId = decodeAuthJwt(req)

    await dbConnect()

    const bots = await Bot.find({ userId })

    return NextResponse.json(bots, { status: StatusCodes.OK })
}

export const POST = errorHandler(createBot)
export const GET = errorHandler(getBots)
