import { errorHandler } from '../../../../lib/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { ApiError } from 'next/dist/server/api-utils'
import { Bot, Component } from '../../../../models'
import { decodeAuthJwt } from '../../../../lib/jwt'
import dbConnect from '../../../../lib/dbConnect'
import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'

async function deleteBot(req: NextRequest, { params }: { params: { botId: string | undefined } }) {
    const { botId } = params

    if (!botId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Could not parse bot id.')
    } else if (!ObjectId.isValid(botId)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid bot id.')
    }

    await dbConnect()

    const userId = decodeAuthJwt(req)

    const result = await Bot.deleteOne({ userId, id: botId })

    if (!result.deletedCount) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Could not find bot with that id.')
    }

    await Component.deleteMany({ botId })

    return NextResponse.json({}, { status: StatusCodes.OK })
}

export const DELETE = errorHandler(deleteBot)
